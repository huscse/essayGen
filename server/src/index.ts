import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import apiRouter from './routes/api';
import { apiLimiter } from './middleware/rateLimiter';
import {
  register,
  login,
  logout,
  getCurrentUser,
  requireAuth,
} from './middleware/auth';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware (only if auth is required)
if (process.env.REQUIRE_AUTH === 'true') {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'change-this-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );
}

// Auth routes (optional)
app.post('/auth/register', register);
app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.get('/auth/me', getCurrentUser);

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Apply auth middleware if required
if (process.env.REQUIRE_AUTH === 'true') {
  app.use('/api', requireAuth);
}

// API routes
app.use('/api', apiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'EssayGen + Paraphrase API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      generate: 'POST /api/generate',
      paraphrase: 'POST /api/paraphrase',
      generateAndParaphrase: 'POST /api/generate-and-paraphrase',
    },
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(
    `🔐 Auth required: ${process.env.REQUIRE_AUTH === 'true' ? 'Yes' : 'No'}`,
  );
  console.log(
    `🔄 Third-party paraphrase API: ${
      process.env.PARAPHRASE_API_BASE_URL
        ? 'Configured'
        : 'Not configured (using LLM fallback)'
    }`,
  );
});

export default app;
