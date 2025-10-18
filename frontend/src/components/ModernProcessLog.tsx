'use client';

import { Terminal } from 'lucide-react';
import Card from '@/components/ui/Card';

interface ModernProcessLogProps {
  logs: string[];
  isLoading: boolean;
}

export default function ModernProcessLog({ logs, isLoading }: ModernProcessLogProps) {
  return (
    <Card variant="outline" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Process Log</h3>
        {isLoading && (
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Running...</span>
          </div>
        )}
      </div>

      <div className="bg-muted/30 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-2">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-xs">Waiting for process to start...</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 rounded animate-in ${
                log.includes('❌')
                  ? 'bg-destructive/10 text-destructive'
                  : log.includes('✅')
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : ''
              }`}
            >
              <span className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">
                {new Date().toLocaleTimeString()}
              </span>
              <span className="flex-1">{log}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
