# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm installed
- Anthropic API key

## Setup (Automated)

Run the setup script:
```bash
./setup.sh
```

This will:
1. Copy .env.example files
2. Install all dependencies

## Manual Setup

### 1. Server Setup
```bash
cd server
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm install
```

### 2. Client Setup
```bash
cd client
cp .env.example .env
npm install
```

## Running the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

Server will start on http://localhost:3001

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Frontend will start on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Fill out the essay form:
   - Enter your topic/prompt
   - Select essay type (argumentative/narrative/expository)
   - Choose tone (formal/casual/academic)
   - Set word count (100-2000)
   - Optionally add an outline
3. Configure paraphrase settings:
   - Mode: standard/fluency/formal/creative
   - Strength: 1-10
4. Click "Generate Essay + Paraphrase"
5. View both original and paraphrased versions
6. Copy, download, or regenerate as needed

## Features

- ✅ AI-powered essay generation
- ✅ Automatic paraphrasing with fallback
- ✅ Side-by-side comparison
- ✅ Copy to clipboard
- ✅ Download as .txt
- ✅ Word count & reading time
- ✅ Rate limiting (10 requests/min)
- ✅ Clean, modern UI

## Troubleshooting

**Port already in use:**
Edit `server/.env` and change `PORT=3001` to another port.

**API errors:**
Verify your `ANTHROPIC_API_KEY` is set correctly in `server/.env`.

**Module errors:**
Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## Environment Variables

### Server (.env)
- `ANTHROPIC_API_KEY` - Required for essay generation
- `PARAPHRASE_API_BASE_URL` - Optional third-party paraphrase API
- `PARAPHRASE_API_KEY` - Optional third-party API key
- `PORT` - Server port (default: 3001)
- `REQUIRE_AUTH` - Enable authentication (default: false)

### Client (.env)
- `VITE_API_URL` - Backend URL (default: http://localhost:3001)
