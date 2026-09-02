import { getMenuData } from '../repositories/menuRepository.js';
import { validateMenu } from '../validators/menuValidator.js';

export const getMenu = async (req, res, _next) => {
  try {
    const menuData = await getMenuData();
    validateMenu(menuData);
    
    res.status(200).json({
      success: true,
      data: menuData
    });
  } catch {
    // Return safe JSON error without exposing filesystem paths or stack traces
    res.status(500).json({
      success: false,
      message: 'Failed to load menu data'
    });
  }
};