import { supabase } from '../supabase';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  level: LogLevel;
  component: string;
  message: string;
  metadata?: Record<string, any>;
}

class SupabaseLogger {
  async log(level: LogLevel, component: string, message: string, context?: Record<string, any>): Promise<void> {
    try {
      await supabase.from('system_logs').insert({
        level,
        component,
        message,
        metadata: context
      });
    } catch (error) {
      // Fallback to console in case of Supabase error
      console.error('Logging failed:', error);
    }
  }

  async info(component: string, message: string, context?: Record<string, any>): Promise<void> {
    return this.log('INFO', component, message, context);
  }

  async warn(component: string, message: string, context?: Record<string, any>): Promise<void> {
    return this.log('WARN', component, message, context);
  }

  async error(component: string, message: string, context?: Record<string, any>): Promise<void> {
    return this.log('ERROR', component, message, context);
  }

  async debug(component: string, message: string, context?: Record<string, any>): Promise<void> {
    return this.log('DEBUG', component, message, context);
  }
}

export const supabaseLogger = new SupabaseLogger();

// Utility functions for common logging patterns
export const logArxivQuery = (query: string, params: Record<string, any>) => {
  return supabaseLogger.info('arxiv-api', 'ArXiv API Query', { query, params });
};

export const logLLMUsage = (model: string, tokens: number, latencyMs: number, metadata?: Record<string, any>) => {
  return supabaseLogger.info('llm-api', 'LLM API Usage', { 
    model, 
    tokens, 
    latencyMs,
    ...metadata
  });
};

export const logError = (error: Error, component: string, context?: Record<string, any>) => {
  return supabaseLogger.error(component, error.message, {
    ...context,
    stack: error.stack
  });
};