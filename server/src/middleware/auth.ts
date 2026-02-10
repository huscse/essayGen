import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User, AuthRequest } from '../types';

// Simple in-memory user store (replace with SQLite/Prisma if auth is needed)
const users: Map<number, User> = new Map();
let nextUserId = 1;

export async function register(req: Request<{}, {}, AuthRequest>, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check if username exists
  const existingUser = Array.from(users.values()).find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user: User = {
    id: nextUserId++,
    username,
    passwordHash,
    createdAt: new Date()
  };

  users.set(user.id, user);

  // Set session
  req.session.userId = user.id;
  req.session.username = user.username;

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username
    }
  });
}

export async function login(req: Request<{}, {}, AuthRequest>, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // Find user
  const user = Array.from(users.values()).find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Set session
  req.session.userId = user.id;
  req.session.username = user.username;

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username
    }
  });
}

export function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const requireAuth = process.env.REQUIRE_AUTH === 'true';
  
  if (!requireAuth) {
    return next();
  }

  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  next();
}

export function getCurrentUser(req: Request, res: Response) {
  if (!req.session.userId) {
    return res.json({ user: null });
  }

  res.json({
    user: {
      id: req.session.userId,
      username: req.session.username
    }
  });
}
