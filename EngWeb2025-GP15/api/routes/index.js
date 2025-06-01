var express = require('express');
var router = express.Router();
const upload = require('../middleware/multerConfig');
const sipController = require('../controllers/sipController');
const itemController = require('../controllers/itemController');
const userController = require('../controllers/userController');
const commentController = require('../controllers/commentController')
const logger = require('../logger');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const passport = require('passport');

const { ensureAuthenticated, isAdmin } = require('../middleware/Auth');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/items',ensureAuthenticated, upload.single('sipzip'), (req, res) => {
  sipController.ingestSIP(req, res);
  logger.info('Novo SIP submetido', { user: req.user?._id });
});

// VISTA PUBLICA
router.get('/api/public/items', (req, res) => {
  itemController.getPublicItems()
    .then(items => {
      logger.info('Consulta de items públicos');
      res.status(200).json(items);
    })
    .catch(err => {
      logger.error('Erro ao listar items públicos', { error: err.message });
      res.status(500).json({ error: err.message });
    });
})

router.get('/api/items/dip/:id/', (req, res) => {
  itemController.getDIPZip(req.params.id, res)
    .then(() => {
      logger.info('Download de DIP', { itemId: req.params.id });
    })
    .catch(err => {
      logger.error('Erro ao gerar DIP', { error: err.message, itemId: req.params.id });
      res.status(500).json({ error: 'Erro ao gerar DIP: ' + err.message });
    });
});

router.post('/api/files/:id/', upload.single('foto'), (req, res) => {
  itemController.findItemById(req.params.id)
  .then(item => {
    if (!item) {
      logger.warn('Tentativa de upload para item inexistente', { itemId: req.params.id });
      return res.status(404).json({ erro: 'Item não encontrado' });
    }

    if (!item.componentes) item.componentes = {};
    if (!Array.isArray(item.componentes.ficheiros)) item.componentes.ficheiros = [];

    const destDir = path.join(__dirname, '../uploads', item.aipPath || '');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const nomeFicheiro = req.file.filename;
    const tempPath = req.file.path;
    const finalPath = path.join(destDir, nomeFicheiro);

    fs.renameSync(tempPath, finalPath);

    item.componentes.ficheiros.push(path.join(item.aipPath || '', nomeFicheiro));

    return item.save().then(() => {
      logger.info('Ficheiro adicionado ao item', { itemId: req.params.id, nomeFicheiro });
      res.json({ sucesso: true, nome: nomeFicheiro });
    });
  })
  .catch(err => {
    logger.error('Erro ao guardar ficheiro', { error: err.message, itemId: req.params.id });
    res.status(500).json({ erro: 'Erro ao guardar ficheiro.' });
  });
});

router.delete('/api/files/:id/*', (req, res) => {
  const itemId = req.params.id;
  const filename = req.params[0];

  itemController.findItemById(itemId)
    .then(item => {
      if (!item) {
        logger.warn('Tentativa de apagar ficheiro de item inexistente', { itemId });
        return res.status(404).json({ erro: 'Item não encontrado' });
      }

      if (!item.componentes || !Array.isArray(item.componentes.ficheiros)) {
        logger.warn('Tentativa de apagar ficheiro de item sem ficheiros', { itemId });
        return res.status(400).json({ erro: 'Item não tem ficheiros.' });
      }

      const ficheiroIndex = item.componentes.ficheiros.findIndex(f => f === filename);

      if (ficheiroIndex === -1) {
        logger.warn('Ficheiro não encontrado no item', { itemId, filename });
        return res.status(404).json({ erro: 'Ficheiro não encontrado no item.' });
      }

      const ficheiroPath = path.join(__dirname, '../uploads', filename);

      if (fs.existsSync(ficheiroPath)) {
        fs.unlinkSync(ficheiroPath);
      }

      item.componentes.ficheiros.splice(ficheiroIndex, 1);

      return item.save().then(() => {
        logger.info('Ficheiro removido do item', { itemId, filename });
        res.json({ sucesso: true, mensagem: 'Ficheiro removido.' });
      });
    })
    .catch(err => {
      logger.error('Erro ao remover ficheiro', { error: err.message, itemId, filename });
      res.status(500).json({ erro: err.message });
    });
});

router.get('/api/files/:filePath(*)', itemController.getFile);

router.post('/api/comments',ensureAuthenticated, (req, res) => {
  const { itemId, texto } = req.body;

  if (!itemId || !texto) {
    logger.warn('Tentativa de criar comentário sem dados obrigatórios');
    return res.status(400).json({ erro: 'Faltam dados obrigatórios.' });
  }

  itemController.findItemById(itemId)
    .then(item => {
      if (!item) {
        logger.warn('Tentativa de comentar item inexistente', { itemId });
        return res.status(404).json({ erro: 'Item não encontrado.' });
      }
      const userId = item.produtor

      return commentController
        .createComment(itemId, texto, userId)
        .then(comment => {
          logger.info('Comentário criado', { itemId, commentId: comment._id });
          res.status(201).json(comment);
        });
    })
    .catch(err => {
      logger.error('Erro ao criar comentário', { error: err.message, itemId });
      res.status(500).json({ erro: err.message });
    });
});

router.get('/api/comments/:itemId', (req, res) => {
  const itemId = req.params.itemId;

  return commentController.getCommentsByItemId(itemId)
    .then(comments => {
      if (!comments || comments.length === 0) {
        logger.info('Sem comentários para item', { itemId });
        return res.status(404).json({ error: 'No comments found for this item.' });
      }
      logger.info('Comentários consultados para item', { itemId });
      res.status(200).json(comments);
    })
    .catch(err => {
      logger.error('Erro ao consultar comentários', { error: err.message, itemId });
      res.status(500).json({ error: err.message });
    });
})

router.get('/api/public/items', async (req, res) => {
  itemController.getPublicItems()
    .then(items => {
      logger.info('Consulta de items públicos');
      res.status(200).json(items);
    })
    .catch(err => {
      logger.error('Erro ao listar items públicos', { error: err.message });
      res.status(500).json({ error: err.message });
    });
})


router.get('/api/items/user/:id',ensureAuthenticated,async (req, res) => {
  itemController.getItemsByUser(req.params.id)
    .then(item => {
      if (!item) {
        logger.warn('Item não encontrado para utilizador', { userId: req.params.id });
        return res.status(404).json({ error: 'Item not found' });
      }
      logger.info('Items consultados para utilizador', { userId: req.params.id });
      res.status(200).json(item);
    })
    .catch(err => {
      logger.error('Erro ao consultar items do utilizador', { error: err.message, userId: req.params.id });
      res.status(500).json({ error: err.message });
    });
})

router.get('/api/items/:id', async (req, res) => {
  itemController.findItemById(req.params.id)
    .then(item => {
      if (!item) {
        logger.warn('Item não encontrado', { itemId: req.params.id });
        return res.status(404).json({ error: 'Item not found' });
      }
      item.stats.views = (item.stats.views || 0) + 1;
      item.save().then(() => {
        logger.info('Visualização de item', { itemId: req.params.id });
        res.status(200).json(item);
      });
    })
    .catch(err => {
      logger.error('Erro ao consultar item', { error: err.message, itemId: req.params.id });
      res.status(500).json({ error: err.message });
    });
})

//VISTA ADMIN
router.get('/api/items', async (req, res) => {
  itemController.getAllItems()
    .then(items => {
      logger.info('Consulta de todos os items');
      res.status(200).json(items);
    })
    .catch(err => {
      logger.error('Erro ao listar todos os items', { error: err.message });
      res.status(500).json({ error: err.message });
    });
})

router.delete('/api/items/:id', (req, res) => {
  itemController.delete(req.params.id)
    .then(item => {
      if (!item) {
        logger.warn('Tentativa de apagar item inexistente', { itemId: req.params.id });
        return res.status(404).json({ error: 'Item not found' });
      }
      logger.info('Item apagado', { itemId: req.params.id });
      res.status(200).json({ message: 'Item deleted successfully' });
    })
    .catch(err => {
      logger.error('Erro ao apagar item', { error: err.message, itemId: req.params.id });
      res.status(500).json({ error: err.message });
    });
});

router.put('/api/items/:id',ensureAuthenticated, (req, res) => {
  itemController.update(req.params.id, req.body)
    .then(itemAtualizado => {
      logger.info('Item atualizado', { itemId: req.params.id });
      res.status(200).json(itemAtualizado);
    })
    .catch(err => {
      logger.error('Erro ao atualizar item', { error: err.message, itemId: req.params.id });
      res.status(400).json({ erro: err.message });
    });
});


// Desnecessário? ///////////////////////////////////////////////////////////////////////////////////////////////
router.patch('/api/items/:id', (req, res) => {
  itemController.update(req.params.id, req.body)
    .then(itemAtualizado => {
      logger.info('Item parcialmente atualizado', { itemId: req.params.id });
      res.status(200).json(itemAtualizado);
    })
    .catch(err => {
      logger.error('Erro ao atualizar parcialmente item', { error: err.message, itemId: req.params.id });
      res.status(400).json({ erro: err.message });
    });
});


router.post('/api/register', userController.register);
router.post('/api/login', userController.login);

router.get('/api/users/:id/stats', (req, res) => {
  itemController.getStats(req.params.id)
    .then(stats => {
      logger.info('Consulta de estatísticas do utilizador', { userId: req.params.id });
      res.json(stats);
    })
    .catch(err => {
      logger.error('Erro ao consultar estatísticas do utilizador', { error: err.message, userId: req.params.id });
      res.status(500).json({ erro: err.message });
    });
});

router.get('/api/users', async (req, res) => {
  userController.getUsers()
    .then(users => {
      logger.info('Consulta de utilizadores');
      res.status(200).json(users);
    })
    .catch(err => {
      logger.error('Erro ao listar utilizadores', { error: err.message });
      res.status(500).json({ error: err.message });
    });
})

// Update user
router.put('/api/users/:id',ensureAuthenticated, userController.update);


router.delete('/api/users/:id', (req, res) => {
  userController.delete(req.params.id)
    .then(userDeletado => {
      if (!userDeletado) {
        logger.warn('Tentativa de apagar utilizador inexistente', { userId: req.params.id });
        return res.status(404).json({ error: 'User not found' });
      }
      logger.info('Utilizador apagado', { userId: req.params.id });
      res.status(200).json({ message: 'User deleted successfully' });
    })
    .catch(err => {
      logger.error('Erro ao apagar utilizador', { error: err.message, userId: req.params.id });
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;