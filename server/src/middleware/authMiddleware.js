import crypto from 'crypto';
import prisma from '../../prisma/client.js';

export const requireAuth = async (req, res, next) => {
  const cookieName = process.env.SESSION_COOKIE_NAME || 'samosa_house_admin_session';
  const token = req.cookies[cookieName];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const sessionHash = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionHash },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date() || session.revokedAt) {
      res.clearCookie(cookieName);
      return res.status(401).json({ success: false, message: 'Session expired or invalid' });
    }

    if (!session.user.isActive) {
      return res.status(401).json({ success: false, message: 'User account disabled' });
    }

    // Update lastUsedAt asynchronously
    prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    }).catch(() => {});

    req.user = session.user;
    req.sessionId = session.id;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'OWNER') {
    return res.status(403).json({ success: false, message: 'Forbidden: Owner role required' });
  }
  next();
};

