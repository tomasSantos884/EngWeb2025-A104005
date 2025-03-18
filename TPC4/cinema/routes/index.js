var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
    title: 'Engenharia Web 2025 ©' ,
    goat: 'Tomas Santos',
    inst: 'UM'
  });
  
});


/* GET home page. */
router.get('/filmes', function(req, res, next) {
  var date = new Date().toISOString().substring(0,16);
  axios.get('http://localhost:3000/filmes?sort=title')
  .then(resp =>{
    res.render('filmes',{'filmes' : resp.data, 'date' : date})
  })
  .catch(err =>{
    res.status(500).render('error',{'error' : err})
  })
});

/* http://localhost:3000/filmes?title=102%20Dalmatians */
router.get('/filmes/edit/:id', function(req, res, next) {
  var date = new Date().toISOString().substring(0,16);
  axios.get('http://localhost:3000/filmes?title='+req.params.id)
  .then(resp =>{
    console.log(resp.data[0])
    res.render('editFilme',{'filme' : resp.data[0], 'date' : date})
  })
  .catch(err =>{
    console.log('AQUI 1')
    res.status(500).render('error',{'error' : err})
  })
}
);

/* POST update filme */
router.post('/filmes/edit/:id', function(req, res, next) {
  var updatedFilme = [{
    title: req.body.title,
    year: req.body.year
  }];

  axios.put('http://localhost:3000/filmes' + req.params.id, updatedFilme)
    .then(resp => {
      res.redirect('/filmes');
    })
    .catch(err => {
      console.log('AQUI 2');
      res.status(500).render('error', { error: err });
    });
});




module.exports = router;
