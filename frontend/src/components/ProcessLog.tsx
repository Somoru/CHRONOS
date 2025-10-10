'use client';

import { useEffect, useRef } from 'react';

interface ProcessLogProps {
  logs: string[];
  isLoading: boolean;
}

export default function ProcessLog({ logs, isLoading }: ProcessLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel p-6">
      <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
        <span className="mr-2">🔬</span>
        Archaeological Process
      </h3>
      
      <div 
        ref={logRef}
        className="h-40 overflow-y-auto bg-black bg-opacity-30 rounded-lg p-4 font-mono text-sm space-y-2"
      >
        {logs.map((log, index) => (
          <div 
            key={index}
            className="flex items-center animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <span className="text-green-400 mr-2">{'>'}</span>
            <span className="text-gray-300">{log}</span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center">
            <span className="text-green-400 mr-2">{'>'}</span>
            <span className="text-gray-300 loading-dots">Processing</span>
            <div className="ml-2 flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        {logs.length} operations completed
      </div>
    </div>
  );
}