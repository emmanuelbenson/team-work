require('dotenv').config();

module.exports = (req, res, next) => {
  if (req.role !== 'admin') {
    const err = new Error('Access denied!');
    return res.status(401).json({
      status: 'error',
      error: err.message
    });
  }

  return next();
};
