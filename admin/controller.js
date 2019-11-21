exports.createEmployee = async (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Unauthorized!');
  }
};
