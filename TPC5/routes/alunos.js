var express = require('express');
var router = express.Router();
var Aluno = require('../controllers/aluno');


/* GET all contracts */
router.get('/', function(req, res, next) {
  Aluno.getAlunos()
  .then(data => res.jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
});

/* POST ALUNO */
router.post('/', function(req, res, next) {
  console.log("Dados recebidos na rota POST /alunos:", req.body);

  Aluno.insertAluno(req.body)
    .then(data => {
      console.log("Aluno inserido com sucesso:", data);
      res.status(201).jsonp(data);
    })
    .catch(erro => {
      console.error("Erro ao inserir aluno:", erro.message);
      res.status(500).jsonp({ error: erro.message });
    });
});


/* GET id contrat. */
router.get('/:id', function(req, res, next) {
  Aluno.getAlunoByID(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});



/* UPDATE ALUNO */
router.put('/:id', function(req, res, next) {
  Aluno.update(req.body, req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).jsonp({ error: `Aluno com ID ${req.params.id} não encontrado.` });
      }
      res.jsonp(data);
    })
    .catch(erro => {
      console.error(`Erro ao atualizar aluno com ID ${req.params.id}:`, erro.message);
      res.status(500).jsonp({ error: erro.message });
    });
});


/* REMOVE ALUNO */

router.delete('/:id', function(req, res, next) {
  Aluno.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});




module.exports = router;
