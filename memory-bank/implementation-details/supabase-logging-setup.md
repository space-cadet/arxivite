# Supabase Logging System Setup
*Created: 2025-05-18*

## Table of Contents
1. [Database Schema](#database-schema)
2. [Database Indexes](#database-indexes)
3. [LLM Token Count Function](#llm-token-count-function)
4. [Scheduled Token Tracking](#scheduled-token-tracking)
   - Enable pg_cron
   - Token Usage Snapshots Table
   - Snapshot Function
   - Daily Scheduling
   - Historical Usage Queries
5. [Log Cleanup Policy](#log-cleanup-policy)
6. [Security Policies](#security-policies)
7. [Logger Implementation](#logger-implementation)
8. [Querying Logs](#querying-logs)
9. [Real Implementation Examples](#real-implementation-examples)
   - ArXiv API Logging
   - LLM API Logging

## Database Schema

```sql
-- Create system_logs table
-- Create logs table
CREATE TABLE system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT now(),
    level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG')),
    component TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Database Indexes

-- Create indexes for performance
```sql
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_component ON system_logs(component);
```

### LLM Token Count Function

-- A simple function to get total token usage between dates

```sql
CREATE OR REPLACE FUNCTION get_total_tokens(
    start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMPTZ DEFAULT NOW()
) RETURNS TABLE (
    total_prompt_tokens BIGINT,
    total_response_tokens BIGINT,
    total_tokens BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM((metadata->>'promptTokens')::bigint), 0)::bigint as total_prompt_tokens,
        COALESCE(SUM((metadata->>'responseTokens')::bigint), 0)::bigint as total_response_tokens,
        COALESCE(SUM((metadata->>'promptTokens')::bigint + (metadata->>'responseTokens')::bigint), 0)::bigint as total_tokens
    FROM system_logs
    WHERE 
        component = 'llm-api'
        AND timestamp BETWEEN start_date AND end_date
        AND level = 'INFO';
END;
$$ LANGUAGE plpgsql;
```

### Scheduled Token Tracking

First, enable the pg_cron extension (requires superuser access):

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

Create a table to store historical token usage:

```sql
-- Create token usage snapshots table
CREATE TABLE IF NOT EXISTS token_usage_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT now(),
    prompt_tokens BIGINT,
    response_tokens BIGINT,
    total_tokens BIGINT,
    total_calls BIGINT,
    avg_latency_ms FLOAT,
    cache_hit_ratio FLOAT,
    valid_json_ratio FLOAT,
    calls_by_model JSONB,
    avg_tokens_per_call FLOAT
);
```

Create the snapshot function:

```sql
-- Create function to snapshot token usage
CREATE OR REPLACE FUNCTION snapshot_token_usage() RETURNS void AS $$
DECLARE
    start_time TIMESTAMPTZ := NOW() - INTERVAL '24 hours';
    end_time TIMESTAMPTZ := NOW();
    token_counts RECORD;
    calls_count BIGINT;
BEGIN
    -- Get base token counts
    SELECT * FROM get_total_tokens(start_time, end_time) INTO token_counts;
    
    -- Get total calls first
    SELECT COUNT(*)::bigint INTO calls_count
    FROM system_logs
    WHERE 
        component = 'llm-api'
        AND timestamp BETWEEN start_time AND end_time
        AND level = 'INFO';
    
    -- Insert enhanced snapshot
    INSERT INTO token_usage_snapshots (
        prompt_tokens, 
        response_tokens, 
        total_tokens,
        total_calls,
        avg_latency_ms,
        cache_hit_ratio,
        valid_json_ratio,
        calls_by_model,
        avg_tokens_per_call
    )
    SELECT 
        token_counts.total_prompt_tokens,
        token_counts.total_response_tokens,
        token_counts.total_tokens,
        calls_count,
        AVG((metadata->>'latencyMs')::float) as avg_latency_ms,
        AVG((metadata->>'cacheHit')::boolean::int)::float as cache_hit_ratio,
        AVG((metadata->>'validJson')::boolean::int)::float as valid_json_ratio,
        (
            SELECT jsonb_object_agg(model, model_count)
            FROM (
                SELECT 
                    metadata->>'model' as model,
                    COUNT(*) as model_count
                FROM system_logs
                WHERE 
                    component = 'llm-api'
                    AND timestamp BETWEEN start_time AND end_time
                    AND level = 'INFO'
                GROUP BY metadata->>'model'
            ) t
        ) as calls_by_model,
        CASE 
            WHEN calls_count > 0 THEN token_counts.total_tokens::float / calls_count::float
            ELSE 0
        END as avg_tokens_per_call
    FROM system_logs
    WHERE 
        component = 'llm-api'
        AND timestamp BETWEEN start_time AND end_time
        AND level = 'INFO'
    GROUP BY 
        token_counts.total_prompt_tokens,
        token_counts.total_response_tokens,
        token_counts.total_tokens,
        calls_count;
END;
$$ LANGUAGE plpgsql;
```

Schedule daily token usage snapshots:

```sql
-- Schedule daily snapshot at midnight
SELECT cron.schedule('daily-token-snapshot', '0 0 * * *', 'SELECT snapshot_token_usage()');
```

Query historical usage:

```sql
-- Get last 30 days of token usage
SELECT * FROM token_usage_snapshots 
WHERE timestamp > NOW() - INTERVAL '30 days'
ORDER BY timestamp DESC;
```

## Log Cleanup Policy

```sql
-- Create automatic cleanup function for old logs
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM system_logs 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
```

## Security Policies

```sql
-- Enable RLS
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated application
CREATE POLICY "Enable insert access for service role" ON system_logs
    FOR INSERT WITH CHECK (true);

-- Allow read access for admin users
CREATE POLICY "Enable read access for admin users" ON system_logs
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE email = '<ADMIN_EMAIL>'
    ));
```

## Fix Incorrect Policy

If incorrect admin email was set:

```sql
-- Drop incorrect policy
DROP POLICY "Enable read access for admin users" ON system_logs;

-- Recreate with correct email
CREATE POLICY "Enable read access for admin users" ON system_logs
    FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE email = '<ADMIN_EMAIL>'
    ));
```

## Logger Implementation

```typescript
// src/lib/logging/logger.ts
import { createClient } from '@supabase/supabase-js'

export type LogLevel = 'INFO' | 'WARN' | 'ERROR'

export class Logger {
  private supabase
  
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
  }

  async log(level: LogLevel, component: string, message: string, metadata?: any) {
    return this.supabase
      .from('system_logs')
      .insert({
        level,
        component,
        message,
        metadata
      })
  }
}

export const logger = new Logger()
```

## Querying Logs

```sql
-- Search for specific query in ArXiv API calls
SELECT timestamp, level, message, metadata
FROM system_logs
WHERE component = 'arxiv-api'
  AND metadata->'params'->>'query' = 'your_search_term';

-- Find LLM API calls with specific response
SELECT timestamp, level, message, metadata
FROM system_logs
WHERE component = 'llm-api'
  AND metadata->>'response' LIKE '%your_term%';

-- Get error logs from last 24 hours
SELECT timestamp, component, message, metadata
FROM system_logs
WHERE level = 'ERROR'
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- Search in nested metadata
SELECT timestamp, level, component, message, metadata
FROM system_logs
WHERE metadata->'params'->>'totalResults' = '790'
ORDER BY timestamp DESC;
```

## Real Implementation Examples

### ArXiv API Logging

```typescript
// Logging ArXiv API query
await logArxivQuery('request', { 
  url,
  finalQuery,
  pageSize,
  start,
  sortBy,
  sortOrder
});

// Logging metadata
await logArxivQuery('metadata', {
  query: params.query,
  actualResults: result.metadata.totalResults,
  metadataResults: metadata.totalResults,
  latencyMs: Date.now() - startTime,
  pageSize: params.pagination?.pageSize || 20,
  page: params.pagination?.page || 0
});
```

### LLM API Logging

```typescript
// Logging LLM API call
await logLLMUsage('gemini-1.5-flash', tokenCount, latencyMs, {
  model: 'gemini-1.5-flash',
  promptTokens: Math.ceil(prompt.length / 4),
  responseTokens: data.candidates[0].tokenCount || 0,
  response: rawContent,
  cacheHit: false,
  validJson: true,
  tokenDetails: {
    prompt: prompt.length,
    response: rawContent.length,
    apiReported: data.candidates[0].tokenCount
  }
});
```