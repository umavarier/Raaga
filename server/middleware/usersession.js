const User = require('../../server/models/user')

const isLogged = async (req, res, next) => {

  if (req.session.user) {
    const user = await User.find({ _id: req.session.user._id })
    console.log(user)
    if (user[0].isBlocked == true) {
      req.session.user = null
      res.redirect('/login')
    } else {
      next()
    }
  } else {
    res.redirect('/login')
  }
};

const notLogged = (req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    res.redirect('/home')
  }
};
module.exports = {
  isLogged,
  notLogged,
}