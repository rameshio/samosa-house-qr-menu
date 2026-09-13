import crypto from 'crypto';

export const csrfProtection = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  const token = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['csrf_token'];
  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
  }
  next();
};

export const generateCsrfToken = (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('csrf_token', token, {
    httpOnly: false, // Must be readable by client to set in header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  res.json({ success: true, csrfToken: token });
};
