import prisma from '../../prisma/client.js';
import { hashPassword } from '../services/authService.js';

export const listStaff = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, displayName: true, role: true, isActive: true, lastLoginAt: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: users });
};

export const createStaff = async (req, res) => {
  const { email, displayName, password } = req.body;
  if (!email || !displayName || !password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Invalid input data' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, displayName, passwordHash, role: 'STAFF' },
    select: { id: true, email: true, displayName: true, role: true, isActive: true }
  });

  await prisma.auditLog.create({
    data: { userId: req.user.id, action: 'CREATE', entityType: 'User', entityId: user.id, summary: `Created staff ${email}` }
  });

  res.json({ success: true, data: user });
};

export const toggleStaffStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

  if (!isActive && targetUser.role === 'OWNER') {
    const activeOwners = await prisma.user.count({ where: { role: 'OWNER', isActive: true } });
    if (activeOwners <= 1) {
      return res.status(400).json({ success: false, message: 'Cannot disable the final active OWNER' });
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true, email: true, displayName: true, role: true, isActive: true }
  });

  if (!isActive) {
    // Revoke their sessions
    await prisma.session.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  await prisma.auditLog.create({
    data: { userId: req.user.id, action: 'UPDATE', entityType: 'User', entityId: user.id, summary: `${isActive ? 'Enabled' : 'Disabled'} user ${targetUser.email}` }
  });

  res.json({ success: true, data: user });
};