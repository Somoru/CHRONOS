'use client';

import { useState } from 'react';

interface InputPanelProps {
  onSubmit: (fragment: string, options: any) => void;
  isLoading: boolean;
}

export default function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [fragment, setFragment] = useState('');
  const [eraDetection, setEraDetection] = useState(true);
  const [maxSources, setMaxSources] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fragment.trim() && !isLoading) {
      onSubmit(fragment.trim(), {
        era_detection: eraDetection,
        max_sources: maxSources
      });
    }
  };

  const loadExample = (example: string) => {
    setFragment(example);
  };

  return (
    <div className="glass-panel p-6">
      <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
        Fragment Input
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label htmlFor="fragment" className="block text-sm font-medium text-gray-300 mb-2">
            Historical Text Fragment
          </label>
          <textarea
            id="fragment"
            value={fragment}
            onChange={(e) => setFragment(e.target.value)}
            placeholder="Enter a fragmented piece of internet history..."
            className="w-full h-32 px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
          <div className="text-xs text-gray-400 mt-1">
            {fragment.length}/2000 characters
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-magenta-300">Options</h3>
          
          {/* Era Detection Toggle */}
          <div className="flex items-center justify-between">
            <label htmlFor="era-detection" className="text-sm text-gray-300">
              Era Detection
            </label>
            <button
              type="button"
              onClick={() => setEraDetection(!eraDetection)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                eraDetection ? 'bg-cyan-500' : 'bg-gray-600'
              }`}
              disabled={isLoading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  eraDetection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Max Sources Slider */}
          <div>
            <label htmlFor="max-sources" className="block text-sm text-gray-300 mb-2">
              Max Sources: {maxSources}
            </label>
            <input
              type="range"
              id="max-sources"
              min="1"
              max="10"
              value={maxSources}
              onChange={(e) => setMaxSources(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Example Buttons */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-magenta-300">Quick Examples</h3>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => loadExample("smh at the top 8 drama. ppl need to chill. g2g, ttyl.")}
              className="text-left p-3 bg-gray-800 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-colors text-sm text-gray-300"
              disabled={isLoading}
            >
              <span className="text-cyan-400">MySpace Era:</span> "smh at the top 8 drama..."
            </button>
            <button
              type="button"
              onClick={() => loadExample("brb, connecting via dialup—phone's busy lol")}
              className="text-left p-3 bg-gray-800 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-colors text-sm text-gray-300"
              disabled={isLoading}
            >
              <span className="text-cyan-400">Dial-up Era:</span> "brb, connecting via dialup..."
            </button>
            <button
              type="button"
              onClick={() => loadExample("that meme with lolcats cracked me up")}
              className="text-left p-3 bg-gray-800 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-colors text-sm text-gray-300"
              disabled={isLoading}
            >
              <span className="text-cyan-400">Meme Era:</span> "that meme with lolcats..."
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!fragment.trim() || isLoading}
          className={`glow-button w-full py-4 text-lg font-bold ${
            isLoading ? 'loading-dots' : ''
          }`}
        >
          {isLoading ? 'Reconstructing' : 'Begin Reconstruction'}
        </button>
      </form>
    </div>
  );
}