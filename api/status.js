// Vercel serverless function: health/status endpoint.
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Samosa House API is running',
    data: { status: 'ok' },
  });
};
