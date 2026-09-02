export const validateMenu = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Invalid JSON format');
  if (data.schemaVersion === undefined) throw new Error('Missing schemaVersion');
  if (data.currency !== 'USD') throw new Error('Currency must be USD');
  if (!Array.isArray(data.categories)) throw new Error('Categories must be an array');

  // New metadata fields
  if (!data.menuType) throw new Error('Missing menuType');
  if (!data.publicationStatus) throw new Error('Missing publicationStatus');
  if (typeof data.isProvisional !== 'boolean') throw new Error('Missing isProvisional');

  const validPriceStatuses = ['confirmed', 'needs-confirmation', 'not-provided'];
  
  const categoryIds = new Set();
  const itemIds = new Set();
  
  data.categories.forEach(category => {
    if (!category.id || typeof category.id !== 'string' || category.id.trim() === '') throw new Error('Category missing id');
    if (!category.name || typeof category.name !== 'string' || category.name.trim() === '') throw new Error('Category missing name');
    
    if (categoryIds.has(category.id)) throw new Error(`Duplicate category ID: ${category.id}`);
    categoryIds.add(category.id);
    
    if (!Array.isArray(category.items)) throw new Error('Category items must be an array');
    
    category.items.forEach(item => {
      if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') throw new Error('Item missing id');
      if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') throw new Error('Item missing name');
      
      if (itemIds.has(item.id)) throw new Error(`Duplicate item ID: ${item.id}`);
      itemIds.add(item.id);
      
      // Price validations
      if (!validPriceStatuses.includes(item.priceStatus)) {
        throw new Error(`Invalid priceStatus: ${item.priceStatus}`);
      }
      
      if (item.basePriceCents !== null && (typeof item.basePriceCents !== 'number' || !Number.isInteger(item.basePriceCents) || item.basePriceCents < 0)) {
        throw new Error('Item price must be null or a non-negative integer');
      }
      
      if (item.priceStatus === 'not-provided' && item.basePriceCents !== null) {
        throw new Error('priceStatus not-provided requires basePriceCents to be null');
      }
      
      if (item.priceStatus === 'confirmed' && typeof item.basePriceCents !== 'number') {
        throw new Error('priceStatus confirmed requires basePriceCents to be an integer');
      }

      // Image validation
      if (item.image !== undefined && item.image !== null) {
        if (typeof item.image !== 'string') {
          throw new Error('Image must be a string or null');
        }
        if (item.image.trim() === '') {
          throw new Error('Image path cannot be blank');
        }
        if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
          throw new Error('Image path cannot be an external URL');
        }
        if (item.image.includes('..') || item.image.includes('//')) {
          throw new Error('Image path contains unsafe traversal or external segments');
        }
        if (!item.image.startsWith('/images/menu/')) {
          throw new Error('Image path must start with /images/menu/');
        }
        const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
        const hasValidExt = validExts.some(ext => item.image.toLowerCase().endsWith(ext));
        if (!hasValidExt) {
          throw new Error('Image path must end with a supported extension (.jpg, .jpeg, .png, .webp)');
        }
      }
    });
  });
  
  return true;
};
