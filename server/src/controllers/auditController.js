import prisma from '../../prisma/client.js';

export const listAuditLogs = async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, displayName: true }
      }
    },
    take: 100 // limit to recent 100 for now
  });
  res.json({ success: true, data: logs });
};