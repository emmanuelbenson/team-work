const queries = require('./queries');

exports.createEmployee = (req, res) => {
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
