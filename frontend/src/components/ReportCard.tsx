'use client';

import { useState, useEffect } from 'react';
import { ReconstructionReport } from '@/types/api';

interface ReportCardProps {
  report: ReconstructionReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showingText, setShowingText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect for reconstructed text
  useEffect(() => {
    setIsRevealed(true);
    const text = report.reconstructed_text;
    let index = 0;
    
    const typewriter = setInterval(() => {
      if (index <= text.length) {
        setShowingText(text.slice(0, index));
        setCurrentIndex(index);
        index++;
      } else {
        clearInterval(typewriter);
      }
    }, 50);

    return () => clearInterval(typewriter);
  }, [report.reconstructed_text]);

  const downloadPDF = async () => {
    try {
      // Simple PDF generation using browser print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Chronos Report - ${report.id}</title>
              <style>
                body { font-family: monospace; padding: 20px; line-height: 1.6; }
                .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                .section { margin-bottom: 20px; }
                .sources { background: #f5f5f5; padding: 10px; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>PROJECT CHRONOS - Archaeological Report</h1>
                <p>Report ID: ${report.id}</p>
                <p>Generated: ${new Date(report.created_at).toLocaleString()}</p>
              </div>
              
              <div class="section">
                <h2>Original Fragment</h2>
                <p>"${report.original_fragment}"</p>
              </div>
              
              <div class="section">
                <h2>Reconstructed Text</h2>
                <p>"${report.reconstructed_text}"</p>
              </div>
              
              <div class="section">
                <h2>Archaeological Analysis</h2>
                <p>${report.explanation}</p>
              </div>
              
              ${report.era_guess ? `
              <div class="section">
                <h2>Era Detection</h2>
                <p>Era: ${report.era_guess.label} (${Math.round(report.era_guess.confidence * 100)}% confidence)</p>
              </div>
              ` : ''}
              
              <div class="section">
                <h2>Contextual Sources</h2>
                ${report.contextual_sources.map(source => `
                  <div class="sources">
                    <strong>${source.title}</strong><br>
                    <em>${source.url}</em><br>
                    ${source.snippet}
                  </div>
                `).join('')}
              </div>
              
              <div class="section">
                <h2>Keywords</h2>
                <p>${report.keywords.join(', ')}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  return (
    <div className={`glass-panel p-8 transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-cyan-300">
          🏺 Archaeological Report
        </h2>
        <button
          onClick={downloadPDF}
          className="glow-button px-4 py-2 text-sm"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Original Fragment */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-magenta-300 mb-2">Original Fragment</h3>
        <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4">
          <code className="text-gray-300 text-sm">"{report.original_fragment}"</code>
        </div>
      </div>

      {/* Reconstructed Text */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-magenta-300 mb-2">Reconstructed Text</h3>
        <div className="bg-green-900 bg-opacity-20 border border-green-500 rounded-lg p-4">
          <code className="text-gray-100 text-sm">
            "{showingText}"
            {currentIndex < report.reconstructed_text.length && (
              <span className="animate-pulse">|</span>
            )}
          </code>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-magenta-300">Reconstruction Confidence</h3>
          <span className="text-cyan-300 font-bold">
            {Math.round(report.reconstruction_confidence * 100)}%
          </span>
        </div>
        <div className="confidence-meter">
          <div 
            className="confidence-fill"
            style={{ width: `${report.reconstruction_confidence * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Era Detection */}
      {report.era_guess && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-magenta-300 mb-2">Era Detection</h3>
          <div className="flex items-center space-x-4">
            <span className={`flicker px-4 py-2 rounded-lg border-2 border-magenta-500 bg-magenta-900 bg-opacity-30`}>
              <strong className="text-magenta-200">{report.era_guess.label}</strong>
            </span>
            <div className="flex-1">
              <div className="text-sm text-gray-300 mb-1">
                Era Confidence: {Math.round(report.era_guess.confidence * 100)}%
              </div>
              <div className="confidence-meter">
                <div 
                  className="confidence-fill"
                  style={{ width: `${report.era_guess.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-magenta-300 mb-2">Archaeological Analysis</h3>
        <p className="text-gray-300 leading-relaxed">{report.explanation}</p>
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-magenta-300 mb-2">Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {report.keywords.map((keyword, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-cyan-900 bg-opacity-30 border border-cyan-500 rounded-full text-cyan-300 text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Contextual Sources */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-magenta-300 mb-4">Contextual Sources</h3>
        <div className="space-y-4">
          {report.contextual_sources.map((source, index) => (
            <div 
              key={index}
              className="glass-panel p-4 hover:bg-opacity-20 transition-all duration-300"
            >
              <h4 className="font-semibold text-cyan-300 mb-2">
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {source.title}
                </a>
              </h4>
              <p className="text-gray-300 text-sm mb-2">{source.snippet}</p>
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 text-xs hover:underline"
              >
                {source.url}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-400 border-t border-gray-600 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Report ID:</strong> {report.id}
          </div>
          <div>
            <strong>Generated:</strong> {new Date(report.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Model:</strong> {report.model_meta.model}
          </div>
          <div>
            <strong>Tokens Used:</strong> {report.model_meta.tokens_used || 'N/A'}
          </div>
        </div>
        {report.model_meta.demo_mode && (
          <div className="mt-2 text-orange-400">
            ⚠️ Demo Mode - Add API keys for full functionality
          </div>
        )}
      </div>
    </div>
  );
}