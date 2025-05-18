# Supabase Logging System Setup
*Created: 2025-05-18*

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

-- Create indexes for performance
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_component ON system_logs(component);
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