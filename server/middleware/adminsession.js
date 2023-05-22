const isLogged = async (req, res, next) => {
  if (req.session.admin) {
    next();
  }
  else {
    res.redirect('/admin')
  }
};

const notLogged = async (req, res, next) => {
  if (!req.session.admin) {
    next()
  } else {
    res.redirect('/admin/adminlogin')
  }
};

module.exports = {
  isLogged,
  notLogged
};