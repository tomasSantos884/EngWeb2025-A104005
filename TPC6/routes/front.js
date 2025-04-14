var express = require('express');
var router = express.Router();
const axios = require('axios');
const apiURL = 'http://localhost:5555/contratos';

router.get('/', function(req, res, next) {
    var date = new Date().toISOString().substring(0, 16);
    axios.get(apiURL)
      .then(resp => {
        res.status(200).render("contratos", { clist: resp.data, data: date });
      })
      .catch(erro => {
        console.error("Erro ao carregar alunos:", erro.message); // Apenas loga o erro
        res.status(500).render("error", { error: erro }); // Renderiza a página de erro
      });
});

router.get('/entidades', function(req, res, next) {
    var date = new Date().toISOString().substring(0, 16);
    axios.get(apiURL + '/entidades')
      .then(resp => {
        console.log(resp.data);
        res.status(200).render("entidades", { clist: resp.data, data: date });
      })
      .catch(erro => {
        console.error("Erro ao carregar alunos:", erro.message); // Apenas loga o erro
        res.status(500).render("error", { error: erro }); // Renderiza a página de erro
      });
});


router.get('/tipos', function(req, res, next) {
    var date = new Date().toISOString().substring(0, 16);
    axios.get(apiURL + '/tipos')
      .then(resp => {
        console.log(resp.data);
        res.status(200).render("tipos", { clist: resp.data, data: date });
      })
      .catch(erro => {
        console.error("Erro ao carregar alunos:", erro.message); // Apenas loga o erro
        res.status(500).render("error", { error: erro }); // Renderiza a página de erro
      });
})

router.get('/contratos/:id', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16);
  axios.get(`${apiURL}/${req.params.id}`)
    .then(resp => {
      res.status(200).render("contrato", { contrato: resp.data, data: date });
    })
    .catch(erro => {
      console.error("Erro ao carregar contrato:", erro.message);
      res.status(500).render("error", { error: erro });
    });
});

router.get('/entidades/:entidade', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16);
  axios.get(`${apiURL}?entidade=${req.params.entidade}`)
    .then(resp => {
      res.status(200).render("contratos", { clist: resp.data, data: date });
    })
    .catch(erro => {
      console.error("Erro ao carregar entidade:", erro.message);
      res.status(500).render("error", { error: erro });
    });
});

router.get('/delete/:id', function(req, res, next) {
  axios.delete(`${apiURL}/${req.params.id}`)
      .then(resp => {
          console.log("Contrato removido:", resp.data);
          const previousPage = req.get('Referer') || '/front'; // Get the Referer header or default to '/front'
          res.status(200).redirect(previousPage); 
      })
      .catch(erro => {
          console.error("Erro ao remover contrato:", erro);
          res.status(500).render("error", { error: erro });
      });
});

router.get('/edit/:id', function(req, res, next) {
  var date = new Date().toISOString().substring(0, 16);
  axios.get(`${apiURL}/${req.params.id}`)
      .then(resp => {
          res.status(200).render("contractEditPage", { contrato: resp.data, data: date });
      })
      .catch(erro => {
          res.status(500).render("error", { error: erro });
      });
});


router.post('/edit/:id', function(req, res, next) {
  var updatedContract = req.body; 
  axios.put(`${apiURL}/${req.params.id}`, updatedContract)
      .then(resp => {
          console.log("Contrato atualizado:", resp.data);
          const previousPage = req.get('Referer') || '/front'; // Get the Referer header or default to '/front'
          res.status(200).redirect(previousPage); 
      })
      .catch(erro => {
          console.error("Erro ao atualizar contrato:", erro);
          res.status(500).render("error", { error: erro });
      });
});


module.exports = router;