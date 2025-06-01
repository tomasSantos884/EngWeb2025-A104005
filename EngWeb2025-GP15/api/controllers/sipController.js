// controllers/sipController.js
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const Item = require('../models/item');
const Ajv = require('ajv');
const glob = require('glob');
const addFormats = require('ajv-formats');
const { default: mongoose } = require('mongoose');
const logger = require('../logger');

exports.ingestSIP = (req, res) => {
  const zipPath = req.file.path;
  const extractPath = path.join(__dirname, '../uploads/temp_' + Date.now());

  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise()
    .then(() => {
      // Procura o manifesto em qualquer subdiretoria
      const manifestFiles = glob.sync(path.join(extractPath, '**/manifesto-SIP.json'));
      if (manifestFiles.length === 0) {
        fs.rmSync(extractPath, { recursive: true, force: true });
        fs.rmSync(zipPath, { force: true });
        logger.warn('Manifesto não encontrado no SIP', { zipPath });
        return res.status(400).json({ erro: 'Manifesto não encontrado.' });
      }
      const manifestPath = manifestFiles[0];

      const manifest = JSON.parse(fs.readFileSync(manifestPath));
      const ajv = new Ajv();
      addFormats(ajv);
      const validate = ajv.compile(require('../validation/manifestSchema.json'));

      // Validar o manifesto
      if (!validate(manifest)) {
        fs.rmSync(extractPath, { recursive: true, force: true });
        fs.rmSync(zipPath, { force: true });
        logger.warn('Manifesto inválido no SIP', { detalhes: validate.errors });
        return res.status(400).json({ erro: 'Manifesto inválido.', detalhes: validate.errors });
      }

      const metadadosPorTipo = {
        Viagens: { destino: manifest.destino || "Desconhecido", duracaoDias: manifest.duracaoDias || null },
        Gastronomia: { restaurante: manifest.restaurante || "", prato: manifest.prato || "" },
        Journaling: { humor: manifest.humor || "", topicos: manifest.topicos || [] },
        Despesas: { valor: manifest.valor || 0, categoria: manifest.categoria || "" },
        Eventos: { evento: manifest.evento || "", local: manifest.local || "" }
      };

      const itemData = {
        ...manifest,
        componentes: manifest.componentes,
        produtor: manifest.produtor,
        submissor: manifest.submissor,
        metadados: metadadosPorTipo[manifest.tipoRecurso] || {}
      };

      const novoItem = new Item(itemData);
      return novoItem.save()
        .then(guardado => {
          const data = new Date(itemData.dataSubmissao);
          const ano = data.getFullYear();
          const mes = String(data.getMonth() + 1).padStart(2, '0');
          const itemId = guardado._id.toString();

          const finalPath = path.join(__dirname, `../uploads/aips/${ano}/${mes}/${itemId}`);
          fs.mkdirSync(finalPath, { recursive: true });

          // mover ficheiros do extractPath para finalPath
          const ficheiros = fs.readdirSync(extractPath);
          ficheiros.forEach(f => {
            fs.renameSync(path.join(extractPath, f), path.join(finalPath, f));
          });

          // Atualizar paths nos campos componentes
          if (guardado.componentes.ficheiros) {
            guardado.componentes.ficheiros = guardado.componentes.ficheiros.map(f => `aips/${ano}/${mes}/${itemId}/${f}`);
          }

          // Se ainda existir o campo fotos, podes migrar assim:
          if (guardado.componentes.fotos && Array.isArray(guardado.componentes.fotos)) {
            guardado.componentes.ficheiros = [
              ...(guardado.componentes.ficheiros || []),
              ...guardado.componentes.fotos.map(f => `aips/${ano}/${mes}/${itemId}/${f}`)
            ];
            delete guardado.componentes.fotos;
          }

          guardado.aipPath = `aips/${ano}/${mes}/${itemId}`;
          return guardado.save()
            .then(() => {
              // Limpar ficheiros temporários
              fs.rmSync(extractPath, { recursive: true, force: true });
              fs.rmSync(zipPath, { force: true });
              logger.info('SIP ingerido com sucesso', { itemId: guardado._id });
              res.status(201).json(guardado);
            });
        });
    })
    .catch(err => {
      logger.error('Erro no processamento do SIP', { error: err.message, stack: err.stack });
      res.status(500).json({ erro: 'Erro no processamento do SIP.' });
    });
};