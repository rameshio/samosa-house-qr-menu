import prisma from '../../prisma/client.js';
import crypto from 'crypto';

export const getAdminMenu = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        menuItems: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu' });
  }
};

export const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { version, isAvailable, ...updates } = req.body;

  try {
    // Handle isAvailable immediately (does not require draft/publish)
    const dataToUpdate = { version: { increment: 1 } };
    
    if (isAvailable !== undefined) {
      dataToUpdate.isAvailable = isAvailable;
    }

    if (Object.keys(updates).length > 0) {
      dataToUpdate.hasDraftChanges = true;
      if (updates.name !== undefined) dataToUpdate.draftName = updates.name;
      if (updates.description !== undefined) dataToUpdate.draftDescription = updates.description;
      if (updates.priceCents !== undefined) dataToUpdate.draftPriceCents = updates.priceCents;
      if (updates.imageUrl !== undefined) dataToUpdate.draftImageUrl = updates.imageUrl;
    }

    // ATOMIC UPDATE: updateMany allows non-unique fields (like version) in the where clause.
    const result = await prisma.menuItem.updateMany({
      where: { id, version },
      data: dataToUpdate
    });

    if (result.count === 0) {
      // Check if it exists at all to distinguish 404 from 409
      const exists = await prisma.menuItem.findUnique({ where: { id } });
      if (!exists) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.status(409).json({ success: false, message: 'Conflict: Document has been modified by another user' });
    }

    const updated = await prisma.menuItem.findUnique({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_DRAFT',
        entityType: 'MenuItem',
        entityId: id,
        summary: `Updated menu item ${updated.name} (Draft)`
      }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update item' });
  }
};

export const createMenuItem = async (req, res) => {
  const { name, description, priceCents, categoryId, imageUrl } = req.body;
  try {
    const category = await prisma.category.findUnique({ where: { id: categoryId }, include: { menuItems: true } });
    if (!category) return res.status(400).json({ success: false, message: 'Invalid category' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const displayOrder = category.menuItems.length;

    const newItem = await prisma.menuItem.create({
      data: {
        id: crypto.randomUUID(),
        slug,
        categoryId,
        name,
        description,
        priceCents,
        imageUrl,
        displayOrder,
        isAvailable: true,
        hasDraftChanges: true, // starts as draft
        draftName: name,
        draftDescription: description,
        draftPriceCents: priceCents,
        draftImageUrl: imageUrl
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE',
        entityType: 'MenuItem',
        entityId: newItem.id,
        summary: `Created new menu item ${name} (Draft)`
      }
    });

    res.json({ success: true, data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create item' });
  }
};

export const publishMenu = async (req, res) => {
  try {
    const draftItems = await prisma.menuItem.findMany({ where: { hasDraftChanges: true } });
    
    await prisma.$transaction(async (tx) => {
      for (const item of draftItems) {
        const result = await tx.menuItem.updateMany({
          where: { id: item.id, version: item.version },
          data: {
            name: item.draftName || item.name,
            description: item.draftDescription ?? item.description,
            priceCents: item.draftPriceCents ?? item.priceCents,
            imageUrl: item.draftImageUrl ?? item.imageUrl,
            hasDraftChanges: false,
            draftName: null,
            draftDescription: null,
            draftPriceCents: null,
            draftImageUrl: null,
            version: { increment: 1 }
          }
        });
        if (result.count === 0) {
          throw new Error('409_CONFLICT');
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'PUBLISH',
        entityType: 'Menu',
        entityId: 'global',
        summary: `Published menu updates for ${draftItems.length} items`
      }
    });

    res.json({ success: true, message: 'Menu published' });
  } catch (err) {
    if (err.message === '409_CONFLICT') {
      return res.status(409).json({ success: false, message: 'Conflict: Document has been modified by another user' });
    }
    res.status(500).json({ success: false, message: 'Failed to publish menu' });
  }
};