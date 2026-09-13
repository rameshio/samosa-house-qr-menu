import prisma from '../../prisma/client.js';

/**
 * Maps the flat database model to the nested structure required by the frontend
 */
export const getMenuData = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' },
    include: {
      menuItems: {
        orderBy: { displayOrder: 'asc' },
      }
    }
  });

  const formattedCategories = categories.map(cat => ({
    id: cat.slug,
    name: cat.name,
    description: "",
    sortOrder: cat.displayOrder,
    items: cat.menuItems.map(item => ({
      id: item.slug,
      name: item.name,
      description: item.description,
      basePriceCents: item.priceCents,
      priceStatus: "needs-confirmation",
      needsReview: true,
      image: item.imageUrl || undefined,
      dietary: item.dietary,
      spicy: item.spicy,
      allergens: item.allergens,
      available: item.isAvailable,
      sortOrder: item.displayOrder,
    }))
  }));

  return {
    schemaVersion: 1,
    currency: "USD",
    menuType: "restaurant",
    publicationStatus: "draft",
    isProvisional: true,
    source: "September 2, 2026 Wix website audit",
    categories: formattedCategories
  };
};