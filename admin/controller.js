const queries = require('./queries');

exports.createEmployee = (req, res) => {
  if (!req.isAuth) {
    const err = new Error('Forbidden!');
    return res.status(403).json({
      status: 'error',
      error: err
    });
  }

  const { email, password } = req.body;
  queries
    .createEmployee(email, password)
    .then(response => {
      return res.status(201).json({
        status: 'success',
        data: response
      });
    })
    .catch(error => {
      return res.json({
        status: 'error',
        error: error
      });
    });
};
