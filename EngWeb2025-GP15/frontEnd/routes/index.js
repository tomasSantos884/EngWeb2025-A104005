var express = require('express');
var router = express.Router();
const axios = require('axios');
const itemController = require('../controllers/itemController');


const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/public', function(req, res, next) {

  itemController.getPublicItems()
    .then(result => {
      res.render('mainPagePublic', { items: result.items || [], user: req.user, erro: null });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erro ao buscar itens');
    });
})





/* GET home page. */
router.get('/',function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  res.redirect(`/me/${req.user._id || req.user.id}`);
});

router.get('/me/add', isAuthenticated,function(req, res, next) {
  res.render('addItemForm', { user: req.user, erro: null });
});

router.get('/me/item/:id/view',isAuthenticated,(req, res) => {
  axios.get(`http://localhost:3000/api/items/${req.params.id}`)
    .then(response => {
      res.render('itemPageView', { item: response.data });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erro ao carregar item');
    });
});

router.get('/me/item/:id', isAuthenticated, function (req, res) {
  axios.get(`http://localhost:3000/api/items/${req.params.id}`)
    .then(response => {
      res.render('itemPage', { item: response.data });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erro ao carregar item');
    });
});



router.get('/me/:id', isAuthenticated, function(req, res, next) {
  const user = req.user;
  
  if (req.params.id !== (user._id || user.id).toString()) {
      return res.status(403).send("Não autorizado a ver esta página.");
  }
  
  itemController.getItems(req.params.id,req.session.token)
    .then(result => {
      res.render('mainPage', { items: result.items || [], user, erro: null , token: req.session.token });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erro ao buscar itens');
    });
});






module.exports = router;
