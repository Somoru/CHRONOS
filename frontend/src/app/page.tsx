'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Moon, Sun, Send, Clock, Home as HomeIcon, Pickaxe, Globe } from 'lucide-react';
import { ReconstructionReport as ReportType } from '@/types/api';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ReconstructionReport from '@/components/ReconstructionReport';

export default function Home() {
  const [fragment, setFragment] = useState('');
  const [report, setReport] = useState<ReportType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true); // Dark by default
  const [eraDetection, setEraDetection] = useState(true);
  const [maxSources, setMaxSources] = useState(5);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // Set dark mode on initial load
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const examples = [
    "such wow. very doge. much amaze. so internet. wow.",
    "smh at the top 8 drama on myspace",
    "not me crying at 3am watching cottagecore aesthetic compilations",
    "why you always lying mmmm oh my god stop lying. do it for the vine"
  ];

  // Typing animation effect
  useEffect(() => {
    if (report && report.reconstructed_text) {
      let currentIndex = 0;
      setDisplayedText('');
      
      const interval = setInterval(() => {
        if (currentIndex <= report.reconstructed_text.length) {
          setDisplayedText(report.reconstructed_text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 15);

      return () => clearInterval(interval);
    }
  }, [report]);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  }, [isLoading]);

  const handleReconstruct = async () => {
    if (!fragment.trim()) return;
    
    setIsLoading(true);
    setReport(null);
    setError(null);
    setDisplayedText('');

    try {
      const response = await fetch('http://localhost:8000/api/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fragment: fragment.trim(),
          options: {
            era_detection: eraDetection,
            max_sources: maxSources,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Error: ${response.statusText}`);
      }

      const result: ReportType = await response.json();
      setReport(result);
      setFragment(''); // Clear input after successful reconstruction
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Failed to reconstruct fragment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleReconstruct();
    }
  };

  const handleReset = () => {
    setFragment('');
    setReport(null);
    setError(null);
    setDisplayedText('');
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-background/80 backdrop-blur-xl">
        <button 
          onClick={handleReset} 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30 relative">
            {isLoading ? (
              <>
                <Globe className="w-4 h-4 text-white/40 absolute" />
                <Pickaxe className="w-5 h-5 text-white absolute animate-swing z-10" />
              </>
            ) : (
              <Sparkles className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent text-left">
              Chronos AI
            </h1>
            <p className="text-[10px] text-muted-foreground text-left">Fragment Reconstruction Engine</p>
          </div>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground border border-border/50 rounded-lg px-3 py-1.5 bg-background/50">
            <span>Powered by</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="33%" stopColor="#9B72CB" />
                  <stop offset="66%" stopColor="#D96570" />
                  <stop offset="100%" stopColor="#D96570" />
                </linearGradient>
              </defs>
              <path 
                d="M12 0.5L13.5 10.5L23.5 12L13.5 13.5L12 23.5L10.5 13.5L0.5 12L10.5 10.5L12 0.5Z" 
                fill="url(#gemini-grad)"
              />
            </svg>
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Gemini</span>
          </div>
          <Badge variant="outline" className="text-[10px] px-2.5 py-1 border-violet-500/30 text-violet-400">
            <Clock className="w-3 h-3 mr-1" />
            Era Detection {eraDetection ? 'ON' : 'OFF'}
          </Badge>
          {report && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="w-9 h-9 p-0 hover:bg-violet-500/10 rounded-lg transition-colors"
              title="New Search"
            >
              <HomeIcon className="w-4 h-4 text-violet-400" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="w-9 h-9 p-0 hover:bg-muted/50 rounded-lg"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area - Scrollable Results */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {!report && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-600/10 to-fuchsia-500/10 flex items-center justify-center backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/20">
                <Sparkles className="w-12 h-12 text-violet-400" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground">Welcome to Chronos AI</h2>
                <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
                  I'm a digital archeologist who reconstructs incomplete text fragments with rich cultural and historical context. Enter a fragment below to bring it back to life.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setFragment(ex)}
                    className="text-sm px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-foreground border border-violet-500/20 hover:border-violet-500/40 transition-all hover:shadow-lg hover:shadow-violet-500/20 hover:scale-105 active:scale-95"
                  >
                    "{ex.slice(0, 50)}{ex.length > 50 ? '...' : ''}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
              <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin shadow-xl shadow-violet-500/30" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-foreground">Reconstructing fragment...</p>
                <p className="text-sm text-muted-foreground">Analyzing cultural context and era markers</p>
              </div>
            </div>
          )}

          {report && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <ReconstructionReport report={report} displayedText={displayedText} />
              
              {/* Example Options - Always Visible */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4 text-center">Try another fragment:</p>
                <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setFragment(ex);
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                      className="text-sm px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-foreground border border-violet-500/20 hover:border-violet-500/40 transition-all hover:shadow-lg hover:shadow-violet-500/20 hover:scale-105 active:scale-95"
                    >
                      "{ex.slice(0, 50)}{ex.length > 50 ? '...' : ''}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-3xl mx-auto mt-8">
              <Card className="border-red-500/50 bg-red-500/10 backdrop-blur-xl">
                <div className="p-6">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input Area at Bottom - ChatGPT Style */}
      <div className="border-t border-border backdrop-blur-xl bg-background/80 shrink-0 shadow-2xl shadow-black/20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                value={fragment}
                onChange={(e: any) => setFragment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter incomplete text fragment here... (Ctrl+Enter to send)"
                className="min-h-[80px] max-h-[200px] resize-none text-base bg-background border-violet-500/20 focus:border-violet-500 rounded-xl px-4 py-3 shadow-lg shadow-violet-500/10 focus:shadow-violet-500/20 transition-all"
                disabled={isLoading}
                aria-label="Text fragment input"
              />
            </div>
            <Button
              onClick={handleReconstruct}
              disabled={!fragment.trim() || isLoading}
              className="h-[80px] px-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white shadow-xl shadow-purple-500/40 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer hover:text-violet-400 transition-colors">
                <input
                  type="checkbox"
                  checked={eraDetection}
                  onChange={(e) => setEraDetection(e.target.checked)}
                  className="w-4 h-4 rounded accent-violet-600"
                  disabled={isLoading}
                />
                <span>Era Detection</span>
              </label>
              <div className="flex items-center gap-2">
                <span>Max Sources:</span>
                <select
                  value={maxSources}
                  onChange={(e) => setMaxSources(Number(e.target.value))}
                  className="text-xs px-2 py-1 rounded-lg border border-violet-500/20 bg-background hover:border-violet-500/40 transition-colors focus:ring-2 focus:ring-violet-500/20"
                  disabled={isLoading}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
            </div>
            <span className={`font-mono ${fragment.length > 1800 ? 'text-destructive' : ''}`}>
              {fragment.length} / 2000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
