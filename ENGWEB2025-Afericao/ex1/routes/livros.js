var express = require('express');
var router = express.Router();
var Livro = require('../controllers/livros');


/* GET all contracts */
router.get('/books', function(req, res, next) {
  if (req.query.character) {
    Livro.getBooksByChar(req.query.character)
      .then(data => res.jsonp(data))
      .catch(erro => res.status(500).jsonp(erro));
  } else if (req.query.genre){
    Livro.getBooksByGenre(req.query.genre)
      .then(data => res.jsonp(data))
      .catch(erro => res.status(500).jsonp(erro));
  }
  else {
    Livro.getLivros()
      .then(data => res.jsonp(data))
      .catch(erro => res.status(500).jsonp(erro));
  }
});


router.get('/books/characters', function(req, res, next) {
  Livro.getCharacters()
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});


router.get('/books/genres', function(req, res, next) {
  Livro.getGenres()
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});

/* GET id book. */
router.get('/books/:id', function(req, res, next) {
  Livro.getLivroBYID(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});




/* router.get('/books?charater=:id', function(req, res, next) {
  Livro.getBooksByChar(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
}); */

/* POST ALUNO */
router.post('/books', function(req, res, next) {
  console.log("Dados recebidos na rota POST /books:", req.body);

  Livro.insertLivro(req.body)
    .then(data => {
      console.log("Livro inserido com sucesso:", data);
      res.status(201).jsonp(data);
    })
    .catch(erro => {
      console.error("Erro ao inserir Livro:", erro.message);
      res.status(500).jsonp({ error: erro.message });
    });
});



/* PUT ALUNO */
router.put('/books/:id', function(req, res, next) {
  Livro.update(req.body, req.params.id)
    .then(data => {
      if (!data) {
        return res.status(404).jsonp({ error: `Livro com ID ${req.params.id} não encontrado.` });
      }
      res.jsonp(data);
    })
    .catch(erro => {
      console.error(`Erro ao atualizar Livro com ID ${req.params.id}:`, erro.message);
      res.status(500).jsonp({ error: erro.message });
    });
});

/* DELETE ALUNO */
router.delete('/books/:id', function(req, res, next) {
  Livro.remove(req.params.id)
    .then(data => res.jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
});




module.exports = router;
