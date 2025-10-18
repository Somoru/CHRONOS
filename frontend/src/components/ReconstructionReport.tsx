import React, { useRef } from 'react';
import { FileText, ExternalLink, Download, Copy } from 'lucide-react';
import { ReconstructionReport as ReportType } from '@/types/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReconstructionReportProps {
  report: ReportType;
  displayedText: string;
}

/**
 * Formal Reconstruction Report Component
 * Meets challenge requirements with 3 mandatory sections:
 * 1. Original Fragment
 * 2. AI-Reconstructed Text
 * 3. Contextual Sources (clickable hyperlinks)
 */
const ReconstructionReport: React.FC<ReconstructionReportProps> = ({ report, displayedText }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Header - Professional Title
      pdf.setFillColor(59, 130, 246); // Blue gradient start
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CHRONOS AI', margin, yPos + 10);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Fragment Reconstruction Report', margin, yPos + 18);
      
      pdf.setFontSize(9);
      pdf.text(`Generated: ${new Date(report.metadata.timestamp).toLocaleString()}`, margin, yPos + 25);
      pdf.text(`Processing Time: ${report.metadata.processing_time_ms}ms`, margin, yPos + 30);

      yPos = 55;
      pdf.setTextColor(0, 0, 0);

      // Section 1: Original Fragment
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text('1. ORIGINAL FRAGMENT', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 100, 100);
      const fragmentLines = pdf.splitTextToSize(`"${report.fragment}"`, contentWidth);
      pdf.text(fragmentLines, margin, yPos);
      yPos += fragmentLines.length * 5 + 10;

      // Section 2: AI-Reconstructed Text
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 51, 234); // Purple
      pdf.text('2. AI-RECONSTRUCTED TEXT', margin, yPos);
      yPos += 8;

      // Confidence Badge
      pdf.setFillColor(59, 130, 246);
      pdf.roundedRect(margin, yPos - 2, 35, 6, 2, 2, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${Math.round(report.reconstruction_confidence * 100)}% Match`, margin + 2, yPos + 2);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const reconstructedLines = pdf.splitTextToSize(report.reconstructed_text, contentWidth);
      pdf.text(reconstructedLines, margin, yPos);
      yPos += reconstructedLines.length * 5 + 8;

      // Stats Grid
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPos, contentWidth / 3 - 2, 15, 'F');
      pdf.rect(margin + contentWidth / 3 + 1, yPos, contentWidth / 3 - 2, 15, 'F');
      pdf.rect(margin + 2 * contentWidth / 3 + 2, yPos, contentWidth / 3 - 2, 15, 'F');

      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('CONFIDENCE', margin + 5, yPos + 5);
      pdf.text('KEYWORDS', margin + contentWidth / 3 + 6, yPos + 5);
      pdf.text('TIME', margin + 2 * contentWidth / 3 + 7, yPos + 5);

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(59, 130, 246);
      pdf.text(`${Math.round(report.reconstruction_confidence * 100)}%`, margin + 5, yPos + 11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${report.keywords?.length || 0}`, margin + contentWidth / 3 + 6, yPos + 11);
      pdf.text(`${report.metadata.processing_time_ms}ms`, margin + 2 * contentWidth / 3 + 7, yPos + 11);

      yPos += 20;

      // Analysis
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('ANALYSIS', margin, yPos);
      yPos += 6;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const analysisLines = pdf.splitTextToSize(report.explanation, contentWidth);
      pdf.text(analysisLines, margin, yPos);
      yPos += analysisLines.length * 4 + 8;

      // Keywords
      if (report.keywords && report.keywords.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(100, 100, 100);
        pdf.text('KEYWORDS', margin, yPos);
        yPos += 6;

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        const keywordsText = report.keywords.join(' • ');
        const keywordLines = pdf.splitTextToSize(keywordsText, contentWidth);
        pdf.text(keywordLines, margin, yPos);
        yPos += keywordLines.length * 4 + 8;
      }

      // Era Detection
      if (report.era_guess && yPos < pageHeight - 40) {
        pdf.setFillColor(243, 232, 255);
        pdf.roundedRect(margin, yPos - 2, contentWidth, 18, 2, 2, 'F');
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(147, 51, 234);
        pdf.text('TIME PERIOD', margin + 3, yPos + 3);
        
        pdf.setFontSize(11);
        pdf.text(report.era_guess.label, margin + 3, yPos + 9);
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`${Math.round(report.era_guess.confidence * 100)}% confident`, margin + 3, yPos + 14);

        yPos += 23;
      }

      // Section 3: Contextual Sources (New Page if needed)
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(236, 72, 153); // Pink
      pdf.text(`3. CONTEXTUAL SOURCES (${report.contextual_sources?.length || 0})`, margin, yPos);
      yPos += 10;

      if (report.contextual_sources && report.contextual_sources.length > 0) {
        report.contextual_sources.forEach((source, idx) => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = margin;
          }

          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(59, 130, 246);
          pdf.text(`${idx + 1}. ${source.title}`, margin + 2, yPos);
          yPos += 6;

          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(59, 130, 246);
          const urlLines = pdf.splitTextToSize(source.url, contentWidth - 2);
          pdf.text(urlLines, margin + 2, yPos);
          yPos += urlLines.length * 4 + 3;

          pdf.setTextColor(100, 100, 100);
          pdf.setFont('helvetica', 'italic');
          const snippetLines = pdf.splitTextToSize(source.snippet, contentWidth - 2);
          pdf.text(snippetLines, margin + 2, yPos);
          yPos += snippetLines.length * 4 + 8;
        });
      }

      // Footer
      const footerY = pageHeight - 15;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, footerY, pageWidth - margin, footerY);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Chronos AI v1.1 • Powered by Gemini AI', margin, footerY + 5);
      pdf.text(`Page ${pdf.getCurrentPageInfo().pageNumber}`, pageWidth - margin - 15, footerY + 5);

      // Save
      pdf.save(`chronos-report-${new Date(report.metadata.timestamp).getTime()}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const handleCopyToClipboard = async () => {
    const textToCopy = `
CHRONOS AI - RECONSTRUCTION REPORT
Generated: ${new Date(report.metadata.timestamp).toLocaleString()}

1. ORIGINAL FRAGMENT
${report.fragment}

2. AI-RECONSTRUCTED TEXT
${report.reconstructed_text}

Confidence: ${Math.round(report.reconstruction_confidence * 100)}%
Processing Time: ${report.metadata.processing_time_ms}ms

ANALYSIS
${report.explanation}

${report.era_guess ? `TIME PERIOD: ${report.era_guess.label} (${Math.round(report.era_guess.confidence * 100)}% confident)\n${report.era_guess.reasoning}\n` : ''}
KEYWORDS
${report.keywords?.join(', ')}

3. CONTEXTUAL SOURCES
${report.contextual_sources?.map((s, i) => `${i + 1}. ${s.title}\n   ${s.url}\n   ${s.snippet}`).join('\n\n')}
    `.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div ref={reportRef} className="space-y-3">
      {/* Compact Header with Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-tight">Reconstruction Report</h2>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {new Date(report.metadata.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
            className="h-8 px-2.5 gap-1.5 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            aria-label="Copy report to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="text-xs">Copy</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadPDF}
            className="h-8 px-2.5 gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:-translate-y-0.5 hover:shadow-xl transition-all"
            aria-label="Download report as PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">PDF</span>
          </Button>
        </div>
      </div>

      {/* Neon Accent Divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 animate-shimmer" />

      {/* Section 1: Original Fragment (REQUIRED) */}
      <Card className="border-l-4 border-l-blue-500">
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
              1. Original Fragment
            </h3>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <p className="text-sm text-foreground font-mono leading-relaxed">
              "{report.fragment}"
            </p>
          </div>
        </div>
      </Card>

      {/* Neon Accent Divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-blue-400/50 animate-shimmer" />

      {/* Section 2: AI-Reconstructed Text (REQUIRED) */}
      <Card className="border-l-4 border-l-purple-500">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                2. AI-Reconstructed Text
              </h3>
            </div>
            <Badge variant="default" className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              {Math.round(report.reconstruction_confidence * 100)}% Match
            </Badge>
          </div>
          
          {/* Reconstructed Text with Gradient Background */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30 shadow-sm mb-2">
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {displayedText}
              {displayedText.length < report.reconstructed_text.length && (
                <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
              )}
            </p>
          </div>

          {/* Metadata - Compact Grid */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-muted/30 rounded-md p-2 text-center border border-border/50">
              <p className="text-[10px] text-muted-foreground mb-0.5">Confidence</p>
              <p className="text-lg font-bold text-primary leading-tight">
                {Math.round(report.reconstruction_confidence * 100)}%
              </p>
            </div>
            <div className="bg-muted/30 rounded-md p-2 text-center border border-border/50">
              <p className="text-[10px] text-muted-foreground mb-0.5">Keywords</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {report.keywords?.length || 0}
              </p>
            </div>
            <div className="bg-muted/30 rounded-md p-2 text-center border border-border/50">
              <p className="text-[10px] text-muted-foreground mb-0.5">Time</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {report.metadata.processing_time_ms}ms
              </p>
            </div>
          </div>

          {/* Analysis & Explanation - Compact */}
          <div className="p-2.5 bg-muted/20 rounded-md border border-border/50 mb-2">
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Analysis
            </h4>
            <p className="text-xs text-foreground leading-relaxed">
              {report.explanation}
            </p>
          </div>

          {/* Keywords Display - Compact */}
          {report.keywords && report.keywords.length > 0 && (
            <div className="mb-2">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Keywords
              </h4>
              <div className="flex flex-wrap gap-1">
                {report.keywords.map((kw, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-[10px] px-1.5 py-0.5 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Era Detection - Compact */}
          {report.era_guess && (
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/20 rounded-md border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Time Period
                </h4>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5">
                    {report.era_guess.label}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(report.era_guess.confidence * 100)}%
                  </span>
                </div>
              </div>
              {report.era_guess.reasoning && (
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  {report.era_guess.reasoning}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Neon Accent Divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-pink-400/50 via-blue-400/50 to-purple-400/50 animate-shimmer" />

      {/* Section 3: Contextual Sources (REQUIRED) */}
      <Card className="border-l-4 border-l-pink-500">
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
              3. Contextual Sources
            </h3>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
              {report.contextual_sources?.length || 0} sources
            </Badge>
          </div>

          {report.contextual_sources && report.contextual_sources.length > 0 ? (
            <div className="space-y-1.5">
              {report.contextual_sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group p-2.5 rounded-md border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  aria-label={`Open source: ${source.title}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <ExternalLink className="w-3 h-3 text-primary shrink-0" />
                        <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {source.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed mb-1">
                        {source.snippet}
                      </p>
                      <p className="text-[10px] text-primary/70 font-mono truncate">
                        {source.url}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-xs">No contextual sources available for this reconstruction.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReconstructionReport;
