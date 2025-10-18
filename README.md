# Project Chronos: The AI Archeologist

A full-stack AI-powered application that reconstructs incomplete text fragments from different internet eras using Google Gemini, era detection with vector embeddings, and contextual web search.

## Team Information

- **Rangisetti Lakshmi Pavan** - SE24UARI015
- **Alekhya Nelabhotla** - SE24UARI043
- **Niharika Navath** - SE24UBIT037
- **Kamishetty Rishi** - SE24UARI025
- **M. Vinay Venkat Kruthin** - SE24UARI075

## Project Description

Project Chronos is an AI-powered web archeologist that takes fragmented, incomplete text from different internet eras and reconstructs them with full context. It uses Google Gemini 2.5 for intelligent text reconstruction, PostgreSQL with pgvector for era detection through semantic similarity, and Google Custom Search API for finding relevant sources. The application features a modern cyberpunk-themed interface with real-time animations and PDF export capabilities.



## Features

###  Core AI Features
- **Intelligent Text Reconstruction**: Uses Google Gemini 2.5 Flash to reconstruct incomplete/fragmented text with full cultural context
- **Era Detection System**: Machine learning-based era identification (late-1990s, early-2000s, mid-2000s, early-2010s, mid-2010s, late-2010s) using PostgreSQL + pgvector
- **Contextual Web Search**: Automatic discovery of 5 relevant web sources using Google Custom Search API
- **Missing Words Analysis**: Identifies and highlights words that were abbreviated or omitted
- **Keyword Extraction**: Automatically extracts relevant keywords from fragments
- **Confidence Scoring**: Reconstruction confidence and era detection confidence percentages

###  User Interface Features
- **Interactive Example Buttons**: 4 pre-loaded example fragments for quick testing
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Era Detection Badge**: Real-time ON/OFF status indicator

###  Output & Export Features
- **Professional PDF Reports**: Download detailed reports with all reconstruction data
- **Formatted Display**: Clean cards showing reconstructed text, era guess, explanations, and sources
- **Always-Visible Examples**: Try another fragment immediately after viewing results

###  Technical Features
- **Demo Mode**: Fully functional with pre-configured responses (no API keys needed)
- **Redis Caching**: Fast response times with intelligent caching
- **Async Architecture**: Non-blocking FastAPI backend
- **Docker Deployment**: One-command setup with docker-compose
- **Health Monitoring**: System status endpoint
- **Interactive API Docs**: Auto-generated Swagger UI at /docs
- **Error Recovery**: Graceful fallbacks if APIs fail
- **CORS Enabled**: Secure cross-origin requests
- **Keyboard Shortcuts**: Ctrl+Enter to submit

###  Advanced Features
- **Vector Embeddings**: 40 pre-seeded era samples in PostgreSQL with pgvector
- **Enhanced Prompting**: Custom Gemini prompts for storytelling-style reconstructions
- **Deduplication**: Smart filtering to avoid duplicate source domains
- **Rate Limiting**: Built-in protection against API abuse
- **Session Management**: Auto-clear input after successful reconstruction


## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Git
- Node
- Python

### 1. Clone the Repository

```bash
git clone https://github.com/Somoru/CHRONOS.git
cd CHRONOS
```

### 2. Install Dependencies

**Backend (Python):**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend (Node.js):**
```bash
cd frontend
npm install
```

### 3. Set Up API Keys

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY=your_google_search_api_key_here
GOOGLE_CX=your_search_engine_id_here
```

**How to get API keys:**

- **Gemini API**: https://makersuite.google.com/app/apikey
- **Google Search API**: https://console.cloud.google.com/apis/credentials
- **Search Engine ID**: https://programmablesearchengine.google.com/

### 4. Run the Application

```bash
docker-compose up --build
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Usage Guide

1. Start the application with `docker-compose up`
2. Open http://localhost:3000 in your browser
3. Enter a text fragment in the input box
4. Press Ctrl+Enter or click the send button
5. View the reconstructed text, era detection, and cultural context
6. Download PDF report if needed

### Example Fragments

```
such wow. very doge. much amaze. so internet. wow.
```

```
smh at the top 8 drama on myspace
```

```
brb connecting via dialup—phone's busy lol
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.12
- **Database**: PostgreSQL 15 + pgvector
- **AI**: Google Gemini 2.5 Flash
- **Search**: Google Custom Search API
- **Cache**: Redis 7

## License

MIT License
