'use client';

import { CheckCircle2, Clock, ExternalLink, Tag, Lightbulb, TrendingUp } from 'lucide-react';
import { ReconstructionReport } from '@/types/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';

interface ModernReportCardProps {
  report: ReconstructionReport;
}

export default function ModernReportCard({ report }: ModernReportCardProps) {
  const confidencePercentage = Math.round(report.reconstruction_confidence * 100);

  return (
    <Card variant="elevated" className="p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">Reconstruction Complete</h2>
          <p className="text-sm text-muted-foreground">
            AI analysis finished • {new Date(report.created_at || report.metadata.timestamp).toLocaleString()}
          </p>
        </div>
        {report.model_meta?.demo_mode && (
          <Badge variant="secondary">Demo Mode</Badge>
        )}
      </div>

      {/* Original Fragment */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Original Fragment
          </h3>
        </div>
        <Card variant="outline" className="p-4 bg-muted/30">
          <p className="text-sm italic leading-relaxed">"{report.original_fragment}"</p>
        </Card>
      </div>

      {/* Reconstructed Text */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-green-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">
            Reconstructed Text
          </h3>
        </div>
        <Card variant="outline" className="p-4 bg-green-500/5 border-green-500/20">
          <p className="text-sm font-medium leading-relaxed">{report.reconstructed_text}</p>
        </Card>
      </div>

      {/* Confidence Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Confidence Score</h3>
          </div>
          <span className="text-2xl font-bold text-primary">{confidencePercentage}%</span>
        </div>
        <Progress value={confidencePercentage} />
      </div>

      {/* Era Detection */}
      {report.era_guess && (
        <Card variant="outline" className="p-4 bg-purple-500/5 border-purple-500/20">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-2">Detected Era</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {report.era_guess.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.round(report.era_guess.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* AI Analysis */}
      {report.explanation && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">AI Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.explanation}
          </p>
        </div>
      )}

      {/* Keywords */}
      {report.keywords && report.keywords.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">
              Keywords <span className="text-muted-foreground font-normal">({report.keywords.length})</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.keywords.map((keyword, idx) => (
              <Badge key={idx} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing Words */}
      {report.missing_words && report.missing_words.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            Missing Words <span className="text-muted-foreground font-normal">({report.missing_words.length})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {report.missing_words.map((word, idx) => (
              <Badge key={idx} variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Contextual Sources */}
      {report.contextual_sources && report.contextual_sources.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            Contextual Sources <span className="text-muted-foreground font-normal">({report.contextual_sources.length})</span>
          </h3>
          <div className="space-y-3">
            {report.contextual_sources.map((source, idx) => (
              <Card key={idx} variant="outline" className="p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-sm mb-2 line-clamp-1">{source.title}</h4>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mb-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate">{source.url}</span>
                </a>
                {source.snippet && (
                  <p className="text-xs text-muted-foreground italic line-clamp-2">"{source.snippet}"</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {report.model_meta && (
            <div>
              <p className="text-muted-foreground mb-1">Model</p>
              <p className="font-medium">{report.model_meta.model}</p>
            </div>
          )}
          {report.model_meta?.tokens_used && (
            <div>
              <p className="text-muted-foreground mb-1">Tokens Used</p>
              <p className="font-medium">{report.model_meta.tokens_used.toLocaleString()}</p>
            </div>
          )}
          {report.id && (
            <div>
              <p className="text-muted-foreground mb-1">Report ID</p>
              <p className="font-medium font-mono text-[10px]">{report.id.substring(0, 8)}...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
