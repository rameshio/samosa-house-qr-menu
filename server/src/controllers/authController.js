import crypto from 'crypto';
import prisma from '../../prisma/client.js';
import { verifyPassword } from '../services/authService.js';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'samosa_house_admin_session';

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  const ttlMinutes = parseInt(process.env.SESSION_TTL_MINUTES || '1440', 10);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await prisma.session.create({
    data: {
      id: sessionHash,
      userId: user.id,
      expiresAt
    }
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  res.cookie(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/admin',
    expires: expiresAt
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    }
  });
};

export const logout = async (req, res) => {
  const sessionId = req.sessionId;
  if (sessionId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    }).catch(() => {});
  }
  res.clearCookie(COOKIE_NAME, { path: '/api/admin' });
  res.json({ success: true });
};

export const getMe = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      role: req.user.role
    }
  });
};

