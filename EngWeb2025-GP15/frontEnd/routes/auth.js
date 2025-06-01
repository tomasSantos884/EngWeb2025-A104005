const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => {
 if (req.isAuthenticated()) { 
    return res.redirect(`/me/${req.user._id || req.user.id}`);
  }
  res.render('login', { erro: null });
});


router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  authController.loginUser(username, password)
    .then(result => {
      if (result.success && result.user && result.token) {
        req.login(result.user, function(err) {
          if (err) {
            console.error("Error in req.login():", err);
            return next(err); 
          }
          
          req.session.token = result.token;
           console.log('Token set in session:', req.session.token); // DEBUG LINE
          
          // Special redirect for 'public' user
          if (result.user.username === 'public') {
            return res.redirect('/public');
          }
          
          // Regular user redirect
          const userId = result.user._id || result.user.id;
          if (!userId) {
            console.error("Login successful but user ID is missing:", result.user);
            req.logout(function(err) { 
              if (err) { return next(err); }
              req.session.destroy(destroyErr => {
                if (destroyErr) {
                  console.error('Error destroying session:', destroyErr);
                }
                res.clearCookie('connect.sid');
                return res.render('login', { erro: 'Erro ao processar dados do utilizador.' });
              });
            });
            return;
          }
          return res.redirect(`/me/${userId}`);
        });
      } else {
        return res.render('login', { erro: result.erro });
      }
    })
    .catch(err => { 
        console.error("Error in login route:", err);
        return res.render('login', { erro: 'Ocorreu um erro inesperado.' });
    });
});


router.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect(`/me/${req.user._id || req.user.id}`);
  }
  res.render('signup', { erro: null });
});


router.post('/signup', (req, res, next) => {
  const { username, password, email, nome } = req.body;
  authController.registerUser(username, password, nome, email)
    .then(result => {
      if (result.success && result.user && result.token) {
        req.login(result.user, function(err) { 
          if (err) {
            console.error("Error in req.login() during signup:", err);
            return next(err);
          }
          req.session.token = result.token;
          return res.redirect(`/me/${result.user._id || result.user.id}`);
        });
      } else {
        return res.render('signup', { erro: result.erro }); 
      }
    })
    .catch(err => {
        console.error("Error in signup route:", err);
        return res.render('signup', { erro: 'Ocorreu um erro inesperado.' });
    });
});


router.get('/logout', (req, res, next) => {
  req.logout(function(err) { 
    if (err) { 
      console.error('Erro ao fazer logout:', err);
      return next(err); 
    }
    req.session.destroy(destroyErr => { 
      if (destroyErr) {
        console.error('Erro ao terminar sessão:', destroyErr);
        return res.redirect('/'); 
      }
    res.clearCookie('connect.sid'); 
    res.redirect('/auth/login');
    }); 
  });
});




module.exports = router;
