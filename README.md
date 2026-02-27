# EssayGen + Paraphrase

A web application that generates AI-powered essays and automatically paraphrases them using third-party APIs with LLM fallback.

## Features

- **Essay Generation**: Generate essays based on topic, type, tone, and length
- **Automatic Paraphrasing**: Paraphrase generated essays using third-party API (QuillBot-like) with LLM fallback
- **Dual Output**: View original and paraphrased versions side-by-side
- **Customization**: Control paraphrase mode and strength
- **Export**: Copy or download both versions
- **Analytics**: Word count and reading time for both drafts

## Tech Stack

### Frontend

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js + Express
- TypeScript
- Prisma + SQLite (optional storage)
- bcrypt (for optional auth)
- express-rate-limit

## Project Structure

```
essaygen-paraphrase/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── providers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key (for Claude)

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Server (.env)

Create `server/.env`:

```env
# Port
PORT=3001

# Anthropic API (for essay generation)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Third-party Paraphrase API (optional)
PARAPHRASE_API_BASE_URL=https://api.paraphrase-service.com
PARAPHRASE_API_KEY=your_paraphrase_api_key_here

# Auth (optional - only needed if platform requires it)
SESSION_SECRET=your_random_secret_key_here
REQUIRE_AUTH=false
```

#### Client (.env)

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Run the Application

#### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

#### Production Build

```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../server
npm run build

# Run production server
npm start
```

## API Endpoints

### POST /api/generate-and-paraphrase

Generate essay and paraphrase it in one call (recommended).

**Request:**

```json
{
  "prompt": "The impact of AI on society",
  "type": "argumentative",
  "tone": "academic",
  "wordCount": 500,
  "outline": "optional outline points",
  "paraphraseMode": "standard",
  "paraphraseStrength": 5
}
```

**Response:**

```json
{
  "original": {
    "text": "...",
    "wordCount": 498,
    "readingTime": 2
  },
  "paraphrased": {
    "text": "...",
    "wordCount": 501,
    "readingTime": 2
  }
}
```

### POST /api/generate

Generate essay only.

### POST /api/paraphrase

Paraphrase existing text.

## Paraphrase Modes

- **standard**: Balanced paraphrasing
- **fluency**: Focus on natural flow
- **formal**: More formal language
- **creative**: More creative variations

Strength: 1-10 (1 = minimal changes, 10 = maximum paraphrasing)

## Features

### Essay Generation

- Topic/prompt input
- Essay types: Argumentative, Narrative, Expository
- Tone options: Formal, Casual, Academic
- Custom word count
- Optional outline guidance

### Paraphrasing

- Third-party API integration with automatic fallback
- Multiple paraphrase modes
- Adjustable strength (1-10)
- Preserves meaning while changing structure

### UI Features

- Side-by-side comparison
- Copy to clipboard
- Download as .txt
- Word count + reading time
- Regenerate options
- Loading states
- Error handling
- Disclaimer notice

## Rate Limiting

- 10 requests per minute per IP address
- Prevents abuse while allowing normal usage

## Disclaimer

This tool generates AI-powered content. Always:

- Verify facts and citations
- Review and edit output
- Use as a draft, not final work
- Follow academic integrity guidelines

## Development

### Adding New Paraphrase Providers

Implement the `ParaphraseProvider` interface:

```typescript
interface ParaphraseProvider {
  paraphrase(text: string, options: ParaphraseOptions): Promise<string>;
}
```

Add your provider in `server/src/providers/`

### Troubleshooting

**Port already in use:**

```bash
# Change PORT in server/.env
PORT=3002
```

**API key errors:**

- Verify ANTHROPIC_API_KEY is set correctly
- Check API key permissions

**Build errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

MIT
