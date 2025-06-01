function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/auth/login'); 
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ erro: 'Acesso reservado a administradores.' });
}

function redirectIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user && (req.user._id || req.user.id)) {
      return res.redirect(`/me/${req.user._id || req.user.id}`);
    } else {
      return next();
    }
  }
  return next();
}

module.exports = {
  isAuthenticated,
  isAdmin,
  redirectIfAuthenticated
};
