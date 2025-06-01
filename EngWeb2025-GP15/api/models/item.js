const mongoose = require('mongoose');

const componenteSchema = new mongoose.Schema({
  texto: String,
  ficheiros: [String]
}, { _id: false });

const itemSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  dataCriacao: { type: Date, required: true },
  dataSubmissao: { type: Date, required: true, default: Date.now },
  produtor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipoRecurso: { 
    type: String, 
    enum: ['Viagens', 'Gastronomia', 'Journaling', 'Despesas', 'Eventos'],
    required: true 
  },
  classificadores: [String],
  visibilidade: { type: Boolean, default: false },
  componentes: componenteSchema,
  comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  aipPath: { type: String },
  metadados: { type: mongoose.Schema.Types.Mixed, default: {} },
  stats: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('item', itemSchema);
