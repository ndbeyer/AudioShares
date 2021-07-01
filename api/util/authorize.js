const keys = require("../config/keys")

const authorize = (req, res, next) => {
  const token = req.headers.authorization;
  if (token !== keys.cronJobSecret) {
    return res.send(`<div>UNAUTHORIZED</div>`);
  } else {
    next();
  }
};

module.exports = authorize