'use client';

import { useState } from 'react';
import InputPanel from '@/components/InputPanel';
import ReportCard from '@/components/ReportCard';
import ProcessLog from '@/components/ProcessLog';
import { ReconstructionReport } from '@/types/api';

export default function Home() {
  const [report, setReport] = useState<ReconstructionReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processLog, setProcessLog] = useState<string[]>([]);

  const handleReconstruct = async (fragment: string, options: any) => {
    setIsLoading(true);
    setReport(null);
    setProcessLog([]);

    try {
      // Simulate processing steps
      setProcessLog(['🔍 Analyzing fragment...']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessLog(prev => [...prev, '🤖 Calling Gemini AI...']);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessLog(prev => [...prev, '🌐 Searching for sources...']);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProcessLog(prev => [...prev, '⏰ Detecting era...']);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Call backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reconstruct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fragment,
          options
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ReconstructionReport = await response.json();
      setReport(result);
      setProcessLog(prev => [...prev, '✅ Reconstruction complete!']);

    } catch (error) {
      console.error('Error:', error);
      setProcessLog(prev => [...prev, '❌ Error occurred during reconstruction']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Matrix Background Effect */}
      <div className="matrix-bg">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              ·
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center pt-16 pb-8">
          <h1 className="cyberpunk-title text-6xl md:text-8xl font-bold mb-4">
            PROJECT CHRONOS
          </h1>
          <p className="text-xl md:text-2xl text-cyan-300 mb-2">
            The AI Archeologist
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Reconstruct fragmented digital history using advanced AI archaeology
          </p>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <InputPanel onSubmit={handleReconstruct} isLoading={isLoading} />
            </div>

            {/* Results Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Process Log */}
              {(isLoading || processLog.length > 0) && (
                <ProcessLog logs={processLog} isLoading={isLoading} />
              )}

              {/* Reconstruction Report */}
              {report && <ReportCard report={report} />}

              {/* Demo Instructions */}
              {!report && !isLoading && (
                <div className="glass-panel p-8 text-center">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-4">
                    Begin Your Archaeological Journey
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Enter a fragmented piece of internet history and watch as Chronos reconstructs its original form,
                    discovers its era, and finds contextual sources.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <h4 className="text-cyan-400 font-bold mb-2">Example 1:</h4>
                      <code className="text-sm text-gray-300">
                        "smh at the top 8 drama. ppl need to chill. g2g, ttyl."
                      </code>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <h4 className="text-cyan-400 font-bold mb-2">Example 2:</h4>
                      <code className="text-sm text-gray-300">
                        "brb, connecting via dialup—phone's busy lol"
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 mt-16 text-gray-400">
          <p>Project Chronos v1.0 - Powered by Gemini AI & Vector Search</p>
        </footer>
      </div>
    </div>
  );
}
