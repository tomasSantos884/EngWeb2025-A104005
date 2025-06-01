const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  texto: { type: String, required: true },
  data: { type: Date, default: Date.now },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }
});

module.exports = mongoose.model('Comment', commentSchema);
