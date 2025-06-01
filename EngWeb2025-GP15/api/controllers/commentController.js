const Comment = require('../models/comment');
const Item = require('../models/item');
const logger = require('../logger');

exports.createComment = (itemId, texto, autor) => {
  if (!autor) {
    logger.warn('Tentativa de criar comentário sem autor', { itemId });
    return Promise.reject(new Error('O campo autor é obrigatório.'));
  }

  const novoComentario = new Comment({
    autor: autor,
    texto,
    item: itemId
  });

  return novoComentario.save()
    .then(comment => {
      return Item.findByIdAndUpdate(
        itemId,
        { $push: { comentarios: comment._id } },
        { new: true }
      ).then(() => {
        logger.info('Comentário criado', { itemId, commentId: comment._id });
        return comment;
      });
    })
    .catch(err => {
      logger.error('Erro ao criar comentário', { itemId, error: err.message });
      throw err;
    });
};

exports.getCommentsByItemId = (itemId) => {
  return Comment.find({ item: itemId }).populate('autor').exec()
    .then(comments => {
      logger.info('Comentários consultados para item', { itemId, total: comments.length });
      return comments;
    })
    .catch(err => {
      logger.error('Erro ao consultar comentários', { itemId, error: err.message });
      throw err;
    });
};