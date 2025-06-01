const Item = require('../models/item');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const logger = require('../logger');

module.exports.getPublicItems = function(req,res) {
  return Item.find({visibilidade: true}).populate({
    path: 'comentarios',
    populate: { path: 'autor' }
  })
    .populate('produtor')
    .exec();
}

module.exports.findItemById = function(id) {
  return Item.findById(id)
    .populate({
      path: 'comentarios',
      populate: { path: 'autor' }
    })
    .populate('produtor')
    .exec();
};
module.exports.getItemsByUser = function(userId) {
  return Item.find({ submissor: userId })
    .populate({
      path: 'comentarios',
      populate: { path: 'autor' }
    })
    .populate('produtor')
    .exec();
};

module.exports.getAllItems = function(req, res) {
  return Item.find().populate('comentarios').exec()
}

module.exports.delete = function(id) {
  return Item.findByIdAndDelete(id).exec()
    .then(item => {
      if (!item) {
        logger.warn('Tentativa de apagar item inexistente', { itemId: id });
        throw new Error('Item not found');
      }

      // Apagar a pasta do AIP se existir
      if (item.aipPath) {
        const aipFullPath = path.join(__dirname, '../uploads/', item.aipPath);
        if (fs.existsSync(aipFullPath)) {
          try {
            fs.rmSync(aipFullPath, { recursive: true, force: true });
            logger.info('Diretoria do AIP removida', { itemId: id, aipPath: item.aipPath });
          } catch (err) {
            logger.error('Erro ao remover diretoria do AIP', { itemId: id, error: err.message });
          }
        } else {
          logger.warn('Diretoria do AIP não existe ao tentar apagar', { itemId: id, aipPath: item.aipPath });
        }
      }

      logger.info('Item apagado', { itemId: id });
      return item;
    })
    .catch(err => {
      logger.error('Erro ao apagar item', { itemId: id, error: err.message });
      throw err;
    });
};

module.exports.getPublicItems = function() {
  return Item.find({ visibilidade: true }).populate('comentarios').exec();
};

module.exports.update = function(id, updateData) {
  return Item.findById(id).exec()
    .then(item => {
      if (!item) {
        logger.warn('Tentativa de atualizar item inexistente', { itemId: id });
        throw new Error('Item not found');
      }

      const camposSimples = [
        'titulo', 'descricao', 'dataCriacao', 'dataSubmissao', 'produtor', 'submissor',
        'tipoRecurso', 'classificadores', 'visibilidade', 'aipPath', 'metadados'
      ];
      camposSimples.forEach(campo => {
        if (updateData[campo] !== undefined) item[campo] = updateData[campo];
      });

      if (updateData.componentes) {
        item.componentes = { ...item.componentes, ...updateData.componentes };
      }

      if (updateData.comentarios && Array.isArray(updateData.comentarios)) {
        updateData.comentarios.forEach(comId => {
          if (!item.comentarios.includes(comId)) {
            item.comentarios.push(comId);
          }
        });
      }

      return item.save();
    })
    .then(itemAtualizado => {
      logger.info('Item atualizado', { itemId: id });
      return itemAtualizado;
    })
    .catch(err => {
      logger.error('Erro ao atualizar item', { itemId: id, error: err.message });
      throw err;
    });
};

module.exports.getFile = function(req, res) {
  const { filePath } = req.params;
  const absPath = path.join(__dirname, '../uploads/', filePath);

  if (fs.existsSync(absPath)) {
    logger.info('Ficheiro enviado', { filePath });
    res.sendFile(absPath);
  } else {
    logger.warn('Ficheiro não encontrado', { filePath });
    res.status(404).json({ erro: 'Ficheiro não encontrado.' });
  }
};

module.exports.getDIPZip = async function(id, res) {
  try {
    const item = await Item.findById(id).exec();
    if (!item) throw new Error('Item não encontrado');
    if (!item.aipPath) throw new Error('AIP não encontrado para este item');

    item.stats = item.stats || {};
    item.stats.downloads = (item.stats.downloads || 0) + 1;
    await item.save();

    const aipFullPath = path.join(__dirname, '../uploads/', item.aipPath);

    // Cria manifesto DIP
    const manifesto = {
      titulo: item.titulo,
      descricao: item.descricao,
      tipoRecurso: item.tipoRecurso,
      classificadores: item.classificadores,
      visibilidade: item.visibilidade,
      componentes: item.componentes,
      metadados: item.metadados,
      aipPath: item.aipPath
    };

    // Cria o ZIP em stream
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="DIP_${item._id}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // Adiciona o manifesto DIP ao zip
    archive.append(JSON.stringify(manifesto, null, 2), { name: 'manifesto-DIP.json' });

    // Adiciona todos os ficheiros do aipPath ao zip
    if (fs.existsSync(aipFullPath)) {
      const files = fs.readdirSync(aipFullPath);
      files.forEach(f => {
        const filePath = path.join(aipFullPath, f);
        archive.file(filePath, { name: f });
      });
    }

    archive.finalize();
    logger.info('DIP gerado e enviado', { itemId: id });

  } catch (err) {
    if (!res.headersSent) {
      logger.error('Erro ao gerar DIP', { itemId: id, error: err.message });
      res.status(500).json({ erro: err.message });
    } else {
      logger.error('Erro ao gerar DIP após envio de headers', { itemId: id, error: err.message });
    }
  }
};

module.exports.getStats = function(userId) {
  return Item.find({ produtor: userId }).then(items => {
    // Viagens
    const viagens = items.filter(i => i.tipoRecurso === 'Viagens');
    const destinos = [...new Set(viagens.map(v => v.metadados?.destino).filter(Boolean))];
    const totalDiasViagem = viagens.reduce((acc, v) => {
      const dias = Number(v.metadados?.duracaoDias);
      return acc + (isNaN(dias) ? 0 : dias);
    }, 0);

    // Gastronomia
    const gastronomia = items.filter(i => i.tipoRecurso === 'Gastronomia');
    const restaurantes = [...new Set(gastronomia.map(g => g.metadados?.restaurante).filter(Boolean))];

    // Despesas
    const despesas = items.filter(i => i.tipoRecurso === 'Despesas');
    const totalGasto = despesas.reduce((acc, d) => {
      const valor = Number(d.metadados?.valor);
      return acc + (isNaN(valor) ? 0 : valor);
    }, 0);
    // Categoria mais cara
    const categoriaGastos = {};
    despesas.forEach(d => {
      const cat = d.metadados?.categoria;
      const valor = Number(d.metadados?.valor);
      if (cat) categoriaGastos[cat] = (categoriaGastos[cat] || 0) + (isNaN(valor) ? 0 : valor);
    });
    let categoriaMaisGasta = null;
    let maxGasto = 0;
    for (const [cat, val] of Object.entries(categoriaGastos)) {
      if (val > maxGasto) {
        maxGasto = val;
        categoriaMaisGasta = cat;
      }
    }

    // Eventos
    const eventos = items.filter(i => i.tipoRecurso === 'Eventos');
    const listaEventos = [...new Set(eventos.map(e => e.metadados?.evento).filter(Boolean))];

    logger.info('Estatísticas calculadas para utilizador', { userId });

    return {
      viagens: {
        destinos,
        totalDiasViagem
      },
      gastronomia: {
        restaurantes
      },
      despesas: {
        totalGasto,
        categoriaMaisGasta
      },
      eventos: {
        listaEventos
      }
    };
  }).catch(err => {
    logger.error('Erro ao calcular estatísticas', { userId, error: err.message });
    throw err;
  });
};