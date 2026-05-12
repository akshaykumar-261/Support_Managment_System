
export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    message,
    ...(data && { data }),
  });
};
