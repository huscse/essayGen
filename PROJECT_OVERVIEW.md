# EssayGen + Paraphrase - Project Overview

## 🎯 Project Description

A full-stack web application that generates AI-powered essays and automatically paraphrases them using third-party APIs with LLM fallback.

## 📁 Project Structure

```
essaygen-paraphrase/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── EssayForm.tsx       # Essay input form
│   │   │   └── ResultsPanel.tsx    # Results display with tabs
│   │   ├── App.tsx                  # Main application
│   │   ├── main.tsx                 # React entry point
│   │   ├── api.ts                   # API client
│   │   ├── types.ts                 # TypeScript types
│   │   └── index.css                # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── providers/
│   │   │   ├── EssayGenerator.ts              # Essay generation with Claude
│   │   │   ├── ThirdPartyParaphraseProvider.ts # Third-party API integration
│   │   │   ├── FallbackLLMParaphraseProvider.ts # LLM fallback paraphraser
│   │   │   └── ParaphraseService.ts           # Orchestration layer
│   │   ├── middleware/
│   │   │   ├── rateLimiter.ts                 # Rate limiting (10 req/min)
│   │   │   └── auth.ts                        # Optional authentication
│   │   ├── routes/
│   │   │   └── api.ts                         # API endpoints
│   │   ├── index.ts                           # Server entry point
│   │   ├── types.ts                           # TypeScript types
│   │   └── utils.ts                           # Helper functions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── README.md                        # Comprehensive documentation
├── QUICK_START.md                   # Quick start guide
├── setup.sh                         # Automated setup script
└── .gitignore

```

## 🔧 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **Anthropic SDK** - Claude API integration
- **express-rate-limit** - Rate limiting
- **bcrypt** - Password hashing (optional auth)
- **express-session** - Session management (optional auth)

## 🚀 Key Features

### Essay Generation
- ✅ Multiple essay types: Argumentative, Narrative, Expository
- ✅ Tone control: Formal, Casual, Academic
- ✅ Adjustable word count (100-2000)
- ✅ Optional outline guidance
- ✅ Powered by Claude Sonnet 4

### Paraphrasing
- ✅ Third-party API integration with automatic fallback to LLM
- ✅ Multiple modes: Standard, Fluency, Formal, Creative
- ✅ Strength control (1-10)
- ✅ Preserves meaning while changing structure

### UI/UX
- ✅ Split-panel layout: Form on left, Results on right
- ✅ Tabbed results: Original | Paraphrased | Compare
- ✅ Copy to clipboard functionality
- ✅ Download as .txt files
- ✅ Word count & reading time metrics
- ✅ Loading states & error handling
- ✅ Responsive design

### Backend Features
- ✅ Rate limiting: 10 requests/minute per IP
- ✅ Environment-based configuration
- ✅ Optional authentication system
- ✅ Graceful error handling
- ✅ Health check endpoint

## 📋 API Endpoints

### POST /api/generate-and-paraphrase (Recommended)
Generate essay and paraphrase in one call.

**Request:**
```json
{
  "prompt": "The impact of AI on society",
  "type": "argumentative",
  "tone": "academic",
  "wordCount": 500,
  "outline": "optional",
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

### GET /api/health
Health check endpoint.

## 🔐 Optional Authentication

Set `REQUIRE_AUTH=true` in `server/.env` to enable minimal local authentication:
- Username + password only
- In-memory user store (easily replaceable with SQLite/Prisma)
- bcrypt password hashing
- HttpOnly session cookies
- No OAuth, no email verification

## 🎨 Design Principles

1. **Simple Stack** - No unnecessary complexity
2. **Progressive Enhancement** - Works without auth by default
3. **Fallback First** - Always have a backup (LLM paraphrasing)
4. **Developer Experience** - Clear structure, good types, comprehensive docs
5. **User Experience** - Clean UI, clear feedback, intuitive flow

## 🔄 Paraphrase Provider Architecture

```typescript
interface ParaphraseProvider {
  paraphrase(text: string, options: ParaphraseOptions): Promise<string>;
}

// Providers:
1. ThirdPartyParaphraseProvider - Calls external API
2. FallbackLLMParaphraseProvider - Uses Claude for paraphrasing

// Orchestration:
ParaphraseService - Tries third-party first, falls back to LLM
```

## 📊 Flow Diagram

```
User Input → Generate Essay (Claude) → Paraphrase Essay → Display Both
                                       ↓
                              Third-party API?
                              ↙            ↘
                           Success      Fallback to Claude
                              ↘            ↙
                              Display Results
```

## 🚦 Getting Started

1. **Prerequisites**: Node.js 18+, npm, Anthropic API key
2. **Setup**: Run `./setup.sh` or follow manual steps in README
3. **Configure**: Add `ANTHROPIC_API_KEY` to `server/.env`
4. **Run**: Start server and client in separate terminals
5. **Use**: Open http://localhost:5173

## 📝 Environment Variables

### Required
- `ANTHROPIC_API_KEY` - For essay generation and LLM paraphrasing

### Optional
- `PARAPHRASE_API_BASE_URL` - Third-party paraphrase API endpoint
- `PARAPHRASE_API_KEY` - Third-party API authentication
- `PORT` - Server port (default: 3001)
- `REQUIRE_AUTH` - Enable authentication (default: false)
- `SESSION_SECRET` - Session encryption key (if auth enabled)

## 🎯 Use Cases

- Students drafting essays with variation options
- Content creators generating multiple versions
- Writers exploring different phrasings
- Academic writing with paraphrasing practice
- Content optimization and rewriting

## ⚠️ Disclaimer

The app includes a prominent disclaimer:
> "This is AI-generated content. Always verify facts, citations, and use as a draft. Follow academic integrity guidelines."

## 🔮 Future Enhancements

- SQLite/Prisma integration for persistent storage
- User essay history
- Export to multiple formats (PDF, DOCX)
- Advanced diff visualization
- Citation generation
- Multi-language support
- Collaborative editing

## 📄 License

MIT
