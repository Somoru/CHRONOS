# Project Chronos — The AI Archeologist

[![Cyberpunk](https://img.shields.io/badge/Theme-Cyberpunk-ff00ff)](https://github.com/yourusername/chronos)
[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)

> *"In the digital ruins of the past, every fragment tells a story. Chronos awakens the sleeping words."*

**Project Chronos** is a cyberpunk-themed AI-powered web application that reconstructs fragmented historical internet text using Google Gemini, detects the era of origin, and finds contextual sources through intelligent web search. Built for hackathons with technical depth and visual polish.

![Chronos Demo](docs/chronos-demo.gif)

## 🌟 Features

### 🔬 Core Functionality
- **Fragment Reconstruction**: Transform incomplete internet text into full, coherent messages
- **Era Detection**: Identify the time period of digital artifacts using AI and vector embeddings
- **Contextual Discovery**: Automatically find relevant sources and documentation
- **Archaeological Analysis**: Detailed explanations of linguistic patterns and cultural context

### 🎮 Technical Highlights  
- **AI Integration**: Google Gemini with strict JSON output and retry logic
- **Vector Search**: PostgreSQL + pgvector for sophisticated era detection
- **Real-time UI**: Animated cyberpunk interface with typewriter effects
- **Export System**: Generate PDF reports of archaeological findings
- **Demo Mode**: Full functionality without API keys for seamless presentations

### 🎨 Visual Excellence
- **Cyberpunk Aesthetic**: Neon colors, glassmorphism, and matrix-style animations
- **Responsive Design**: Works beautifully on desktop and mobile
- **Interactive Animations**: Flicker effects, confidence meters, and loading sequences
- **Professional Output**: Clean, shareable reconstruction reports

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/chronos.git
cd chronos
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API keys (optional - demo mode works without them)
# GEMINI_API_KEY=your_gemini_api_key_here
# GOOGLE_API_KEY=your_google_api_key_here
# GOOGLE_CX=your_google_search_engine_id_here
```

### 3. Launch with Docker
```bash
# Start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 Demo Examples

Try these sample fragments to see Chronos in action:

### Example 1: MySpace Era
```
Input: "smh at the top 8 drama. ppl need to chill. g2g, ttyl."
Output: Reconstructs to full sentences, identifies mid-2000s era, finds MySpace-related sources
```

### Example 2: Dial-up Era  
```
Input: "brb, connecting via dialup—phone's busy lol"
Output: Explains dial-up internet context, identifies late-1990s era, finds historical sources
```

### Example 3: Meme Culture
```
Input: "that meme with lolcats cracked me up"
Output: Identifies LOLcat meme culture, late-2000s era, finds relevant meme history
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI    │───▶│   FastAPI       │───▶│   PostgreSQL    │
│   (Frontend)    │    │   (Backend)     │    │   + pgvector    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐    ┌─────────────────┐
         └──────────────▶│   Google APIs   │    │     Redis       │
                        │ (Gemini+Search) │    │   (Caching)     │
                        └─────────────────┘    └─────────────────┘
```

### Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, anime.js, TypeScript
- **Backend**: FastAPI (Python), asyncio, Pydantic
- **Database**: PostgreSQL 15 with pgvector extension
- **AI**: Google Gemini 1.5 Pro for text reconstruction
- **Search**: Google Custom Search JSON API
- **Cache**: Redis for API response caching
- **Infrastructure**: Docker Compose for local development

## 📊 API Reference

### Core Endpoint
```http
POST /api/reconstruct
Content-Type: application/json

{
  "fragment": "ur text fragment here",
  "options": {
    "era_detection": true,
    "max_sources": 5
  }
}
```

### Response Format
```json
{
  "id": "uuid",
  "original_fragment": "...",
  "reconstructed_text": "...",
  "explanation": "...",
  "missing_words": ["..."],
  "keywords": ["..."],
  "reconstruction_confidence": 0.9,
  "contextual_sources": [
    {"title": "...", "url": "...", "snippet": "..."}
  ],
  "era_guess": {"label": "mid-2000s", "confidence": 0.92},
  "created_at": "2024-01-01T00:00:00Z",
  "model_meta": {"model": "gemini-1.5-pro", "tokens_used": 150}
}
```

## 🛠️ Development

### Local Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Local Frontend Development  
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```bash
# Initialize database with pgvector
docker-compose up db -d
docker-compose exec db psql -U postgres -d chronos -f /docker-entrypoint-initdb.d/01-init.sql
```

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests  
cd frontend
npm test
```

## 🎨 Customization

### Adding New Era Patterns
Edit `backend/app/services/era_detector.py`:
```python
self.keyword_patterns = {
    "your-era": [r"\byour_pattern\b", r"\banother_pattern\b"],
    # ... existing patterns
}
```

### Customizing the UI Theme
Modify CSS variables in `frontend/src/app/globals.css`:
```css
:root {
  --neon-cyan: #00ffff;
  --neon-magenta: #ff00ff;
  --deep-indigo: #1a0f2e;
  /* ... other variables */
}
```

## 🧪 Demo Mode

Chronos includes a comprehensive demo mode that works without API keys:

- **Automatic Activation**: Enables when `GEMINI_API_KEY` or `GOOGLE_API_KEY` are missing
- **Sample Responses**: Pre-configured responses for common examples
- **Full UI Testing**: All animations and features work in demo mode
- **Perfect for Presentations**: No internet dependency for core functionality

## 📸 Creating Demo Video

### Recommended Flow:
1. **Introduction** (15 seconds): Show the landing page and explain the concept
2. **Example 1** (45 seconds): Reconstruct a MySpace-era fragment, show animations
3. **Example 2** (30 seconds): Demonstrate dial-up era detection
4. **Feature Highlight** (30 seconds): Show PDF export and confidence meters
5. **Closing** (15 seconds): Highlight technical stack and innovation

### Recording Tips:
- Use OBS Studio or similar screen recording software
- Record at 1920x1080 resolution
- Ensure smooth animations by recording at 60fps
- Add background music that fits the cyberpunk theme

## 🏆 Hackathon Submission

### Scoring Criteria Coverage:
- ✅ **Functional MVP**: Complete reconstruction pipeline
- ✅ **AI Integration**: Advanced Gemini usage with robust JSON parsing
- ✅ **Technical Depth**: Vector embeddings, async architecture, caching
- ✅ **Visual Polish**: Professional cyberpunk UI with animations
- ✅ **Innovation Factor**: Era detection and archaeological narrative
- ✅ **Documentation**: Comprehensive setup and usage guides

### Deployment Options:
- **Local Demo**: Use Docker Compose for reliable presentations
- **Cloud Deploy**: Deploy to Railway, Render, or Vercel + PlanetScale
- **GitHub Pages**: Frontend-only mode with mock backend responses

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for advanced language understanding
- **pgvector** for efficient similarity search
- **Orbitron & Roboto Mono** fonts for the cyberpunk aesthetic
- **Internet Archive** for preserving digital history
- **The hackathon community** for pushing innovation boundaries

---

<div align="center">

**Built with ⚡ by digital archaeologists for digital archaeologists**

[Demo](https://chronos-demo.vercel.app) • [Documentation](docs/) • [Issues](https://github.com/yourusername/chronos/issues) • [Discord](https://discord.gg/chronos)

</div>