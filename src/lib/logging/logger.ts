import fs from 'fs/promises';
import path from 'path';
import { app } from '@electron/remote';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LOG_FILES = 5;

export class FileLogger {
  private logPath: string;
  private currentLogFile: string;

  constructor() {
    // Store logs in user data directory
    const userDataPath = app.getPath('userData');
    this.logPath = path.join(userDataPath, 'logs');
    this.currentLogFile = path.join(this.logPath, 'arxivite.log');
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

  async log(level: LogLevel, message: string, context?: Record<string, any>): Promise<void> {
    await this.ensureLogDirectory();
    await this.rotateLogsIfNeeded();

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    const formattedEntry = this.formatEntry(entry);
    await fs.appendFile(this.currentLogFile, formattedEntry + '\n', 'utf-8');
  }

  private formatEntry(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      context: entry.context || {}
    });
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.access(this.logPath);
    } catch {
      await fs.mkdir(this.logPath, { recursive: true });
    }
  }

  private async rotateLogsIfNeeded(): Promise<void> {
    try {
      const stats = await fs.stat(this.currentLogFile);
      
      if (stats.size >= MAX_LOG_SIZE) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = path.join(
          this.logPath,
          `arxivite-${timestamp}.log`
        );
        
        await fs.rename(this.currentLogFile, rotatedFile);
        
        // Clean up old log files
        const files = await fs.readdir(this.logPath);
        const logFiles = files
          .filter(f => f.startsWith('arxivite-'))
          .sort()
          .reverse();
        
        if (logFiles.length > MAX_LOG_FILES) {
          const filesToDelete = logFiles.slice(MAX_LOG_FILES);
          await Promise.all(
            filesToDelete.map(file =>
              fs.unlink(path.join(this.logPath, file))
            )
          );
        }
      }
    } catch (error) {
      // If file doesn't exist yet, that's fine
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

// Export singleton instance
export const logger = new FileLogger();

// Export utility methods for common logging patterns
export const logArxivQuery = (query: string, params: Record<string, any>) => {
  return logger.info('ArXiv API Query', { query, params });
};

export const logLLMUsage = (model: string, tokens: number, latencyMs: number) => {
  return logger.info('LLM API Usage', { model, tokens, latencyMs });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  return logger.error(error.message, {
    ...context,
    stack: error.stack
  });
};