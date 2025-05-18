import { supabase } from '../supabase';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class SupabaseLogger {
  async log(level: LogLevel, message: string, context?: Record<string, any>): Promise<void> {
    try {
      await supabase.from('logs').insert({
        level,
        message,
        context,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Fallback to console in case of Supabase error
      console.error('Logging failed:', error);
    }
  }

  async info(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('INFO', message, context);
  }

  async warn(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('WARN', message, context);
  }

  async error(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('ERROR', message, context);
  }

  async debug(message: string, context?: Record<string, any>): Promise<void> {
    return this.log('DEBUG', message, context);
  }
}

export const supabaseLogger = new SupabaseLogger();

// Utility functions for common logging patterns
export const logArxivQuery = (query: string, params: Record<string, any>) => {
  return supabaseLogger.info('ArXiv API Query', { query, params });
};

export const logLLMUsage = (model: string, tokens: number, latencyMs: number) => {
  return supabaseLogger.info('LLM API Usage', { model, tokens, latencyMs });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  return supabaseLogger.error(error.message, {
    ...context,
    stack: error.stack
  });
};