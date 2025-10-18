export interface ContextualSource {
  title: string;
  url: string;
  snippet: string;
}

export interface EraGuess {
  label: string;
  confidence: number;
  reasoning?: string;
}

export interface ReconstructionReport {
  id?: string;
  fragment: string;
  original_fragment?: string;
  reconstructed_text: string;
  explanation: string;
  missing_words?: string[];
  keywords: string[];
  reconstruction_confidence: number;
  contextual_sources: ContextualSource[];
  era_guess?: EraGuess;
  created_at?: string;
  metadata: {
    timestamp: string;
    processing_time_ms: number;
  };
  model_meta?: {
    model: string;
    tokens_used?: number;
    demo_mode?: boolean;
  };
}

export interface ReconstructRequest {
  fragment: string;
  options: {
    era_detection?: boolean;
    max_sources?: number;
  };
}