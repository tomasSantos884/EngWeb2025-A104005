const passport = require('passport'); 

// Verify if the user is authenticated using JWT
const ensureAuthenticated = passport.authenticate('jwt', { session: false });

// Verify if the user has Admin role
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ erro: 'Acesso negado. Recurso apenas para administradores.' });
}

module.exports = { 
  ensureAuthenticated,
  isAdmin
};