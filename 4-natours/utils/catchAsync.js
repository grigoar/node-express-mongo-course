module.exports = (fn) => {
  //we need to return a function that will be called by the express when someone hits that route
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    // fn(req, res, next).catch((err) => next(err));//==
  };
};
