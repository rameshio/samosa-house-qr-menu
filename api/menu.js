// Vercel serverless function: public menu endpoint.
// Serves the provisional menu directly from the bundled JSON dataset so the
// customer-facing QR menu works on Vercel with no database.
const menu = require('../server/data/menu.json');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).json({ success: true, data: menu });
};
