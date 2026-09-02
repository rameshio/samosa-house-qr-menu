export const getStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Samosa House API is running",
    data: {
      status: "ok"
    }
  });
};
