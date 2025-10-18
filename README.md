# Project Chronos: The AI Archeologist# Project Chronos: The AI Archeologist# Project Chronos — The AI Archeologist



A full-stack AI-powered application that reconstructs incomplete text fragments from different internet eras using Google Gemini, era detection with vector embeddings, and contextual web search.



## Team InformationA full-stack AI-powered application that reconstructs incomplete text fragments from different internet eras using Google Gemini, era detection with vector embeddings, and contextual web search.[![Cyberpunk](https://img.shields.io/badge/Theme-Cyberpunk-ff00ff)](https://github.com/yourusername/chronos)



- **Rangisetti Lakshmi Pavan** - SE24UARI015[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)

- **Alekhya Nelabhotla** - SE24UARI043

- **Niharika Navath** - SE24UBIT037## Student Information[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)

- **Kamishetty Rishi** - SE24UARI025

- **M. Vinay Venkat Kruthin** - SE24UARI075[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)



## Project Description**Student Name**: [Your Name]  



Project Chronos is an AI-powered web archeologist that takes fragmented, incomplete text from different internet eras and reconstructs them with full context. It uses Google Gemini 2.5 for intelligent text reconstruction, PostgreSQL with pgvector for era detection through semantic similarity, and Google Custom Search API for finding relevant sources. The application features a modern cyberpunk-themed interface with real-time animations and PDF export capabilities.**Student ID**: [Your ID]> *"In the digital ruins of the past, every fragment tells a story. Chronos awakens the sleeping words."*



## Setup Instructions



### Prerequisites## Project Description**Project Chronos** is a cyberpunk-themed AI-powered web application that reconstructs fragmented historical internet text using Google Gemini, detects the era of origin, and finds contextual sources through intelligent web search. Built for hackathons with technical depth and visual polish.

- Docker and Docker Compose installed

- Git



### 1. Clone the RepositoryProject Chronos is an AI-powered web archeologist that takes fragmented, incomplete text from different internet eras and reconstructs them with full context. It uses Google Gemini 2.5 for intelligent text reconstruction, PostgreSQL with pgvector for era detection through semantic similarity, and Google Custom Search API for finding relevant sources. The application features a modern cyberpunk-themed interface with real-time animations and PDF export capabilities.![Chronos Demo](docs/chronos-demo.gif)

```bash

git clone https://github.com/Somoru/CHRONOS.git

cd CHRONOS

```## Setup Instructions## 🌟 Features



### 2. Install Dependencies



The project uses Docker Compose, so all dependencies are automatically installed. However, if you want to run services locally:### Prerequisites### 🔬 Core Functionality



**Backend dependencies** (Python):- Docker and Docker Compose installed- **Fragment Reconstruction**: Transform incomplete internet text into full, coherent messages

```bash

cd backend- Git- **Era Detection**: Identify the time period of digital artifacts using AI and vector embeddings

pip install -r requirements.txt

```- **Contextual Discovery**: Automatically find relevant sources and documentation



**Frontend dependencies** (Node.js):### 1. Clone the Repository- **Archaeological Analysis**: Detailed explanations of linguistic patterns and cultural context

```bash

cd frontend```bash

npm install

```git clone https://github.com/Somoru/CHRONOS.git### 🎮 Technical Highlights  



### 3. Set Up API Keyscd CHRONOS- **AI Integration**: Google Gemini with strict JSON output and retry logic



Create a `.env` file in the project root:```- **Vector Search**: PostgreSQL + pgvector for sophisticated era detection



```bash- **Real-time UI**: Animated cyberpunk interface with typewriter effects

# Google Gemini API Key

GEMINI_API_KEY=your_gemini_api_key_here### 2. Install Dependencies- **Export System**: Generate PDF reports of archaeological findings



# Google Custom Search API Key- **Demo Mode**: Full functionality without API keys for seamless presentations

GOOGLE_API_KEY=your_google_search_api_key_here

The project uses Docker Compose, so all dependencies are automatically installed. However, if you want to run services locally:

# Google Custom Search Engine ID

GOOGLE_CX=your_search_engine_id_here### 🎨 Visual Excellence

```

**Backend dependencies** (Python):- **Cyberpunk Aesthetic**: Neon colors, glassmorphism, and matrix-style animations

**How to get API keys:**

```bash- **Responsive Design**: Works beautifully on desktop and mobile

- **Gemini API Key**: Go to [Google AI Studio](https://makersuite.google.com/app/apikey), sign in, and create an API key

- **Google Search API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create a project, enable "Custom Search JSON API", and create credentialscd backend- **Interactive Animations**: Flicker effects, confidence meters, and loading sequences

- **Search Engine ID**: Go to [Programmable Search Engine](https://programmablesearchengine.google.com/), create a search engine, and copy the Search Engine ID

pip install -r requirements.txt- **Professional Output**: Clean, shareable reconstruction reports

> **Note**: The application has a demo mode that works without API keys for testing purposes.

```

### 4. Run the Application

## 🚀 Quick Start

**Using Docker (Recommended):**

```bash**Frontend dependencies** (Node.js):

docker-compose up --build

``````bash### Prerequisites



**Or run services individually:**cd frontend- Docker & Docker Compose



Backend:npm install- Node.js 18+ (for local frontend development)

```bash

cd backend```- Python 3.11+ (for local backend development)

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

```



Frontend:### 3. Set Up API Keys### 1. Clone the Repository

```bash

cd frontend```bash

npm run dev

```Create a `.env` file in the project root:git clone https://github.com/yourusername/chronos.git



Database (requires PostgreSQL with pgvector):cd chronos

```bash

docker-compose up db -d```bash```

```

# Google Gemini API Key

Redis (optional, for caching):

```bashGEMINI_API_KEY=your_gemini_api_key_here### 2. Environment Setup

docker-compose up redis -d

``````bash



### 5. Access the Application# Google Custom Search API Key# Copy environment template



- **Frontend**: http://localhost:3000GOOGLE_API_KEY=your_google_search_api_key_herecp .env.example .env

- **Backend API**: http://localhost:8000

- **API Documentation**: http://localhost:8000/docs



## Usage Guide# Google Custom Search Engine ID# Add your API keys (optional - demo mode works without them)



### Running the ApplicationGOOGLE_CX=your_search_engine_id_here# GEMINI_API_KEY=your_gemini_api_key_here



1. **Start the application**:```# GOOGLE_API_KEY=your_google_api_key_here

   ```bash

   docker-compose up# GOOGLE_CX=your_google_search_engine_id_here

   ```

**How to get API keys:**```

2. **Open your browser** to http://localhost:3000



3. **Enter a text fragment** in the input box at the bottom. For example:

   ```- **Gemini API Key**: Go to [Google AI Studio](https://makersuite.google.com/app/apikey), sign in, and create an API key### 3. Launch with Docker

   such wow. very doge. much amaze. so internet. wow.

   ```- **Google Search API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create a project, enable "Custom Search JSON API", and create credentials```bash



4. **Click the send button** or press `Ctrl+Enter` to reconstruct the fragment- **Search Engine ID**: Go to [Programmable Search Engine](https://programmablesearchengine.google.com/), create a search engine, and copy the Search Engine ID# Start all services



5. **View the results**:docker-compose up --build

   - Reconstructed full text with context

   - Era detection (e.g., "early-2010s" with confidence score)> **Note**: The application has a demo mode that works without API keys for testing purposes.

   - Cultural explanation

   - Web sources for further reading# Or run in background

   - Missing words analysis

### 4. Run the Applicationdocker-compose up -d --build

6. **Export results**: Click the "Download PDF Report" button to save the reconstruction

```

### Example Commands

**Using Docker (Recommended):**

**Test the backend API directly:**

```bash```bash### 4. Access the Application

curl -X POST "http://localhost:8000/api/reconstruct" \

  -H "Content-Type: application/json" \docker-compose up --build- **Frontend**: http://localhost:3000

  -d "{\"fragment\": \"brb mom calling on landline\", \"options\": {\"era_detection\": true, \"max_sources\": 5}}"

``````- **Backend API**: http://localhost:8000



**Check application health:**- **API Docs**: http://localhost:8000/docs

```bash

curl http://localhost:8000/health**Or run services individually:**

```

## 🎯 Demo Examples

**Run backend tests:**

```bashBackend:

cd backend

pytest```bashTry these sample fragments to see Chronos in action:

```

cd backend

**Build frontend for production:**

```bashuvicorn app.main:app --reload --host 0.0.0.0 --port 8000### Example 1: MySpace Era

cd frontend

npm run build``````

npm start

```Input: "smh at the top 8 drama. ppl need to chill. g2g, ttyl."



### Example Fragments to TryFrontend:Output: Reconstructs to full sentences, identifies mid-2000s era, finds MySpace-related sources



1. **MySpace Era (mid-2000s)**:```bash```

   ```

   smh at the top 8 drama on myspacecd frontend

   ```

npm run dev### Example 2: Dial-up Era  

2. **Dial-up Era (late-1990s)**:

   `````````

   brb connecting via dialup—phone's busy lol

   ```Input: "brb, connecting via dialup—phone's busy lol"



3. **Vine Era (early-2010s)**:Database (requires PostgreSQL with pgvector):Output: Explains dial-up internet context, identifies late-1990s era, finds historical sources

   ```

   why you always lying mmmm oh my god stop lying. do it for the vine```bash```

   ```

docker-compose up db -d

4. **Doge Meme (early-2010s)**:

   ``````### Example 3: Meme Culture

   such wow. very doge. much amaze. so internet. wow.

   ``````



### FeaturesRedis (optional, for caching):Input: "that meme with lolcats cracked me up"



- **AI Text Reconstruction**: Powered by Google Gemini 2.5 Flash```bashOutput: Identifies LOLcat meme culture, late-2000s era, finds relevant meme history

- **Era Detection**: Vector similarity search using PostgreSQL + pgvector

- **Web Search Integration**: Automatic source discovery via Google Custom Searchdocker-compose up redis -d```

- **Real-time UI**: Animated interface with typing effects and progress indicators

- **PDF Export**: Generate professional reports of reconstructions```

- **Dark/Light Theme**: Toggle between themes

- **Demo Mode**: Works without API keys for testing## 🏗️ Architecture



### Troubleshooting### 5. Access the Application



**If the application doesn't start:**```

- Ensure Docker is running: `docker --version`

- Check if ports 3000, 8000, 5432, 6379 are available- **Frontend**: http://localhost:3000┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐

- View logs: `docker-compose logs`

- **Backend API**: http://localhost:8000│   Next.js UI    │───▶│   FastAPI       │───▶│   PostgreSQL    │

**If reconstruction fails:**

- Verify API keys are correctly set in `.env`- **API Documentation**: http://localhost:8000/docs│   (Frontend)    │    │   (Backend)     │    │   + pgvector    │

- Check backend logs: `docker-compose logs backend`

- Demo mode activates automatically if keys are missing└─────────────────┘    └─────────────────┘    └─────────────────┘



**Database connection issues:**## Usage Guide         │                       │                       │

- Restart database: `docker-compose restart db`

- Check database logs: `docker-compose logs db`         │              ┌─────────────────┐    ┌─────────────────┐



## Project Structure### Running the Application         └──────────────▶│   Google APIs   │    │     Redis       │



```                        │ (Gemini+Search) │    │   (Caching)     │

chronos/

├── backend/                  # FastAPI backend1. **Start the application**:                        └─────────────────┘    └─────────────────┘

│   ├── app/

│   │   ├── main.py          # API endpoints   ```bash```

│   │   ├── core/            # Configuration

│   │   ├── models/          # Data models   docker-compose up

│   │   └── services/        # Business logic

│   ├── requirements.txt     # Python dependencies   ```### Tech Stack

│   └── Dockerfile

├── frontend/                # Next.js frontend- **Frontend**: Next.js 15, TailwindCSS, anime.js, TypeScript

│   ├── src/

│   │   ├── app/            # Pages and layouts2. **Open your browser** to http://localhost:3000- **Backend**: FastAPI (Python), asyncio, Pydantic

│   │   ├── components/     # React components

│   │   └── types/          # TypeScript types- **Database**: PostgreSQL 15 with pgvector extension

│   ├── package.json        # Node.js dependencies

│   └── Dockerfile3. **Enter a text fragment** in the input box at the bottom. For example:- **AI**: Google Gemini 1.5 Pro for text reconstruction

├── infra/                   # Database initialization

│   └── db-init/   ```- **Search**: Google Custom Search JSON API

│       └── 01-init.sql     # PostgreSQL schema

├── docker-compose.yml       # Docker orchestration   "such wow. very doge. much amaze. so internet. wow."- **Cache**: Redis for API response caching

└── README.md               # This file

```   ```- **Infrastructure**: Docker Compose for local development



## Technologies Used



- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS4. **Click the send button** or press `Ctrl+Enter` to reconstruct the fragment## 📊 API Reference

- **Backend**: FastAPI, Python 3.12, Pydantic

- **Database**: PostgreSQL 15 with pgvector extension

- **Cache**: Redis 7

- **AI**: Google Gemini 2.5 Flash5. **View the results**:### Core Endpoint

- **Search**: Google Custom Search JSON API

- **Deployment**: Docker & Docker Compose   - Reconstructed full text with context```http



## License   - Era detection (e.g., "early-2010s" with confidence score)POST /api/reconstruct



MIT License - see LICENSE file for details.   - Cultural explanationContent-Type: application/json


   - Web sources for further reading

   - Missing words analysis{

  "fragment": "ur text fragment here",

6. **Export results**: Click the "Download PDF Report" button to save the reconstruction  "options": {

    "era_detection": true,

### Example Commands    "max_sources": 5

  }

**Test the backend API directly:**}

```bash```

curl -X POST "http://localhost:8000/api/reconstruct" \

  -H "Content-Type: application/json" \### Response Format

  -d '{```json

    "fragment": "brb mom calling on landline",{

    "options": {  "id": "uuid",

      "era_detection": true,  "original_fragment": "...",

      "max_sources": 5  "reconstructed_text": "...",

    }  "explanation": "...",

  }'  "missing_words": ["..."],

```  "keywords": ["..."],

  "reconstruction_confidence": 0.9,

**Check application health:**  "contextual_sources": [

```bash    {"title": "...", "url": "...", "snippet": "..."}

curl http://localhost:8000/health  ],

```  "era_guess": {"label": "mid-2000s", "confidence": 0.92},

  "created_at": "2024-01-01T00:00:00Z",

**Run backend tests:**  "model_meta": {"model": "gemini-1.5-pro", "tokens_used": 150}

```bash}

cd backend```

pytest

```## 🛠️ Development



**Build frontend for production:**### Local Backend Development

```bash```bash

cd frontendcd backend

npm run buildpip install -r requirements.txt

npm startuvicorn app.main:app --reload --host 0.0.0.0 --port 8000

``````



### Example Fragments to Try### Local Frontend Development  

```bash

1. **MySpace Era (mid-2000s)**:cd frontend

   ```npm install

   "smh at the top 8 drama on myspace"npm run dev

   ``````



2. **Dial-up Era (late-1990s)**:### Database Setup

   ``````bash

   "brb connecting via dialup—phone's busy lol"# Initialize database with pgvector

   ```docker-compose up db -d

docker-compose exec db psql -U postgres -d chronos -f /docker-entrypoint-initdb.d/01-init.sql

3. **Vine Era (early-2010s)**:```

   ```

   "why you always lying mmmm oh my god stop lying. do it for the vine"### Running Tests

   ``````bash

# Backend tests

4. **Doge Meme (early-2010s)**:cd backend

   ```pytest

   "such wow. very doge. much amaze. so internet. wow."

   ```# Frontend tests  

cd frontend

### Featuresnpm test

```

- **AI Text Reconstruction**: Powered by Google Gemini 2.5 Flash

- **Era Detection**: Vector similarity search using PostgreSQL + pgvector## 🎨 Customization

- **Web Search Integration**: Automatic source discovery via Google Custom Search

- **Real-time UI**: Animated interface with typing effects and progress indicators### Adding New Era Patterns

- **PDF Export**: Generate professional reports of reconstructionsEdit `backend/app/services/era_detector.py`:

- **Dark/Light Theme**: Toggle between themes```python

- **Demo Mode**: Works without API keys for testingself.keyword_patterns = {

    "your-era": [r"\byour_pattern\b", r"\banother_pattern\b"],

### Troubleshooting    # ... existing patterns

}

**If the application doesn't start:**```

- Ensure Docker is running: `docker --version`

- Check if ports 3000, 8000, 5432, 6379 are available### Customizing the UI Theme

- View logs: `docker-compose logs`Modify CSS variables in `frontend/src/app/globals.css`:

```css

**If reconstruction fails:**:root {

- Verify API keys are correctly set in `.env`  --neon-cyan: #00ffff;

- Check backend logs: `docker-compose logs backend`  --neon-magenta: #ff00ff;

- Demo mode activates automatically if keys are missing  --deep-indigo: #1a0f2e;

  /* ... other variables */

**Database connection issues:**}

- Restart database: `docker-compose restart db````

- Check database logs: `docker-compose logs db`

## 🧪 Demo Mode

## Project Structure

Chronos includes a comprehensive demo mode that works without API keys:

```

chronos/- **Automatic Activation**: Enables when `GEMINI_API_KEY` or `GOOGLE_API_KEY` are missing

├── backend/                  # FastAPI backend- **Sample Responses**: Pre-configured responses for common examples

│   ├── app/- **Full UI Testing**: All animations and features work in demo mode

│   │   ├── main.py          # API endpoints- **Perfect for Presentations**: No internet dependency for core functionality

│   │   ├── core/            # Configuration

│   │   ├── models/          # Data models## 📸 Creating Demo Video

│   │   └── services/        # Business logic

│   ├── requirements.txt     # Python dependencies### Recommended Flow:

│   └── Dockerfile1. **Introduction** (15 seconds): Show the landing page and explain the concept

├── frontend/                # Next.js frontend2. **Example 1** (45 seconds): Reconstruct a MySpace-era fragment, show animations

│   ├── src/3. **Example 2** (30 seconds): Demonstrate dial-up era detection

│   │   ├── app/            # Pages and layouts4. **Feature Highlight** (30 seconds): Show PDF export and confidence meters

│   │   ├── components/     # React components5. **Closing** (15 seconds): Highlight technical stack and innovation

│   │   └── types/          # TypeScript types

│   ├── package.json        # Node.js dependencies### Recording Tips:

│   └── Dockerfile- Use OBS Studio or similar screen recording software

├── infra/                   # Database initialization- Record at 1920x1080 resolution

│   └── db-init/- Ensure smooth animations by recording at 60fps

│       └── 01-init.sql     # PostgreSQL schema- Add background music that fits the cyberpunk theme

├── docker-compose.yml       # Docker orchestration

└── README.md               # This file## 🏆 Hackathon Submission

```

### Scoring Criteria Coverage:

## Technologies Used- ✅ **Functional MVP**: Complete reconstruction pipeline

- ✅ **AI Integration**: Advanced Gemini usage with robust JSON parsing

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS- ✅ **Technical Depth**: Vector embeddings, async architecture, caching

- **Backend**: FastAPI, Python 3.12, Pydantic- ✅ **Visual Polish**: Professional cyberpunk UI with animations

- **Database**: PostgreSQL 15 with pgvector extension- ✅ **Innovation Factor**: Era detection and archaeological narrative

- **Cache**: Redis 7- ✅ **Documentation**: Comprehensive setup and usage guides

- **AI**: Google Gemini 2.5 Flash

- **Search**: Google Custom Search JSON API### Deployment Options:

- **Deployment**: Docker & Docker Compose


## License- **GitHub Pages**: Frontend-only mode with mock backend responses



MIT License - see LICENSE file for details.## 🤝 Contributing


1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
