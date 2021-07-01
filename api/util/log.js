const log = (req, res, next) => {
    //eslint-disable-next-line no-console
    console.log("hit route: ", req && req.route && req.route.path);
    next();
  };

module.exports = log