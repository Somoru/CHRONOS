'use client';

import { useState } from 'react';
import { Send, Sparkles, Settings2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ModernInputPanelProps {
  onSubmit: (fragment: string, options: any) => void;
  isLoading: boolean;
}

export default function ModernInputPanel({ onSubmit, isLoading }: ModernInputPanelProps) {
  const [fragment, setFragment] = useState('');
  const [eraDetection, setEraDetection] = useState(true);
  const [maxSources, setMaxSources] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fragment.trim()) {
      onSubmit(fragment, {
        era_detection: eraDetection,
        max_sources: maxSources,
      });
    }
  };

  const examples = [
    'The quick brown fox jumps over the lazy...',
    'To be or not to be, that is the...',
    'In a hole in the ground there lived a...',
    'smh at the top 8 drama. ppl need to chill...'
  ];

  const wordCount = fragment.trim().split(/\s+/).length;

  return (
    <Card variant="elevated" className="p-6 sticky top-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Input Fragment</h2>
        </div>

        {/* Textarea */}
        <div>
          <Textarea
            placeholder="Enter your incomplete text fragment here...

Example: 'The quick brown fox jumps over the...'"
            value={fragment}
            onChange={(e) => setFragment(e.target.value)}
            disabled={isLoading}
            rows={8}
            className="font-mono text-sm resize-none"
          />
          {fragment && (
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
              <span>{fragment.length} characters</span>
            </div>
          )}
        </div>

        {/* Examples */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quick Examples</label>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFragment(example)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed truncate max-w-full"
              >
                {example.length > 30 ? example.substring(0, 30) + '...' : example}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Options</h3>
          </div>

          {/* Era Detection Toggle */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className="text-sm">⏰ Era Detection</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">AI</Badge>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={eraDetection}
              onClick={() => setEraDetection(!eraDetection)}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                eraDetection ? 'bg-primary' : 'bg-muted'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  eraDetection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {/* Max Sources Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              📚 Max Sources: <span className="text-primary">{maxSources}</span>
            </label>
            <div className="flex gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxSources(num)}
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    maxSources === num
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary hover:bg-secondary/80'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading || !fragment.trim()}
          isLoading={isLoading}
        >
          {isLoading ? 'Processing...' : 'Reconstruct Text'}
          {!isLoading && <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  );
}
