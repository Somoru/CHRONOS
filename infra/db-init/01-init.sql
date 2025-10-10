-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_fragment TEXT NOT NULL,
    reconstructed_text TEXT NOT NULL,
    explanation TEXT,
    missing_words TEXT[],
    keywords TEXT[],
    reconstruction_confidence REAL,
    era_label TEXT,
    era_confidence REAL,
    contextual_sources JSONB,
    model_meta JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    embedding vector(1536)
);

-- Create era_samples table for era detection
CREATE TABLE era_samples (
    id SERIAL PRIMARY KEY,
    sample_text TEXT NOT NULL,
    era_label TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_era_label ON reports(era_label);
CREATE INDEX IF NOT EXISTS idx_era_samples_era_label ON era_samples(era_label);

-- Create ivfflat indexes for fast nearest neighbor searches
CREATE INDEX IF NOT EXISTS idx_era_samples_embedding ON era_samples 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_reports_embedding ON reports 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Insert sample era data for era detection
INSERT INTO era_samples (sample_text, era_label) VALUES
-- Late 1990s
('brb, connecting via dialup—phone''s busy lol', 'late-1990s'),
('check out my geocities page', 'late-1990s'),
('downloading this MP3 on Napster', 'late-1990s'),
('AOL Instant Messenger is down again', 'late-1990s'),
('404 not found', 'late-1990s'),

-- Early 2000s
('just burned a mix CD for you', 'early-2000s'),
('my LiveJournal is so emo', 'early-2000s'),
('Friendster is better than MySpace', 'early-2000s'),
('check my away message', 'early-2000s'),
('downloading on Kazaa', 'early-2000s'),

-- Mid 2000s
('smh at the top 8 drama. ppl need to chill. g2g, ttyl.', 'mid-2000s'),
('omg myspace layout is fire', 'mid-2000s'),
('just got rickrolled', 'mid-2000s'),
('epic fail on this forum post', 'mid-2000s'),
('pwned by a noob', 'mid-2000s'),

-- Late 2000s
('that meme with lolcats cracked me up', 'late-2000s'),
('nom nom nom cookies', 'late-2000s'),
('over 9000!', 'late-2000s'),
('do not want!', 'late-2000s'),
('this is sparta!', 'late-2000s'),

-- Early 2010s
('rt if u agree. #yolo', 'early-2010s'),
('rage comic about this', 'early-2010s'),
('forever alone meme', 'early-2010s'),
('trollface.jpg', 'early-2010s'),
('u mad bro?', 'early-2010s'),

-- Mid 2010s
('sliding into DMs', 'mid-2010s'),
('netflix and chill', 'mid-2010s'),
('on fleek', 'mid-2010s'),
('sorry not sorry', 'mid-2010s'),
('basic af', 'mid-2010s'),

-- Late 2010s
('this is not it chief', 'late-2010s'),
('weird flex but ok', 'late-2010s'),
('stan twitter is wild', 'late-2010s'),
('periodt', 'late-2010s'),
('and i oop', 'late-2010s'),

-- Early 2020s
('no cap fr fr', 'early-2020s'),
('its giving main character energy', 'early-2020s'),
('periodt bestie', 'early-2020s'),
('touch grass', 'early-2020s'),
('based and redpilled', 'early-2020s');