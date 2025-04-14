var express = require('express');
var router = express.Router();
var contrato = require('../controllers/contrato');


/* GET all contracts */
router.get('/', function(req, res, next) {
  if(req.query.entidade){
    contrato.getContratosByEntidade(req.query.entidade)
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(error));
  }else if (req.query.tipo){
    contrato.getContratosByTipo(req.query.tipo)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
  }else{
    contrato.getContratos()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
  }
});

/* LISTA ENTIDADES */

router.get('/entidades', function(req, res, next) {
  console.log("entidades");
  contrato.getEntidades()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
});


/* LISTA TIPOS */

router.get('/tipos', function(req, res, next) {
  contrato.getTipos()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
});


/* GET id contrat. */
router.get('/:id', function(req, res, next) {
  contrato.getContratoById(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
});

/* POST CONTRACT */
router.post('/', function(req, res, next) {
  contrato.insertContrato(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
});

/* UPDATE ID */

router.put('/:id', function(req, res, next) {
  contrato.update(req.body,req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error));
});

/* REMOVE ID */

router.delete('/:id', function(req, res, next) { 
  contrato.delete(req.params.id)
    .then((result) => { 
      res.status(200).jsonp(result)    
    }).catch((err) => {
      res.status(500).jsonp(err)
    });

});





module.exports = router;
