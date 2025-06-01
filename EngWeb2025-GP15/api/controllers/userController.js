const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

module.exports.register = async function(req, res) {
  const { username, nome, email, password } = req.body;

  try {
    const newUser = new User({
      username: username,
      nome: nome,
      email: email,
      dataRegisto: new Date(),
    });

    await User.register(newUser, password);

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro no servidor durante o login pós-registo.' });
      }
      if (!user) {
        return res.status(400).json({ erro: info ? info.message : 'Falha ao autenticar após registo.' });
      }
      req.logIn(user, { session: false }, (loginErr) => { 
        if (loginErr) {
          return res.status(500).json({ erro: 'Erro ao estabelecer sessão pós-registo.' });
        }
        const payload = {
          id: user._id,
          username: user.username,
          nome: user.nome,
          email: user.email,
          role: user.role,
          sub: 'EngWeb2025-GP15-API' 
        };
        const token = jwt.sign(
          payload,
          'EngWeb2025-GP15-SecretKey', 
          { expiresIn: '1h' } 
        );
        const userToReturn = { ...user.toObject() };
        delete userToReturn.hash;
        delete userToReturn.salt;
        logger.info('Utilizador registado e logado com sucesso', { username, email });
        return res.status(201).json({ mensagem: 'Utilizador registado e logado com sucesso!', token: token, user: userToReturn });
      });
    })(req, res);

  } catch (err) {
    if (err.name === 'UserExistsError') {
      logger.warn('Tentativa de registo de utilizador já existente', { username, email });
      return res.status(409).json({ erro: err.message || 'Utilizador já existe.' });
    }
    logger.error('Erro ao registar utilizador', { error: err.message, username, email });
    return res.status(500).json({ erro: err.message || 'Erro ao registar utilizador.' });
  }
};

module.exports.getUsers = function() {
  return User.find().select('-hash -salt').exec()
    .then(users => {
      logger.info('Consulta de utilizadores');
      return users;
    })
    .catch(err => {
      logger.error('Erro ao consultar utilizadores', { error: err.message });
      throw err;
    });
};


module.exports.update = async function(req, res) {
  const userId = req.params.id; 
  const { username, nome, email, passwor, role } = req.body;

  if (role && (!req.user || req.user.role !== 'admin')) {
    return res.status(403).json({ erro: 'Não autorizado a alterar o role.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    if (username) user.username = username;
    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (role) {
        if (User.schema.path('role').enumValues.includes(role)) {
            user.role = role;
        } else {
            return res.status(400).json({ erro: `Role inválido: ${role}` });
        }
    }

    if (password) {
      await user.setPassword(password);
    }

    const updatedUser = await user.save();

    const userToReturn = { ...updatedUser.toObject() };
    delete userToReturn.hash;
    delete userToReturn.salt;

    return res.status(200).json({ mensagem: 'Utilizador atualizado com sucesso.', user: userToReturn });

  } catch (err) {
  logger.error('Erro ao atualizar utilizador', { error: err.message, userId });
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(409).json({ erro: 'Username ou email já existe.' });
    }
    return res.status(500).json({ erro: 'Erro ao atualizar utilizador.' });
  }
};


module.exports.delete = function(userId) {
  return User.findByIdAndDelete(userId)
    .then(user => {
      if (!user) {
        logger.warn('Tentativa de apagar utilizador inexistente', { userId });
        throw new Error('Utilizador não encontrado.');
      }
      logger.info('Utilizador apagado', { userId });
      return user;
    })
    .catch(err => {
      logger.error('Erro ao apagar utilizador', { error: err.message, userId });
      throw err;
    });
};


module.exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => { // Set session to false
    if (err) {
      logger.error('Erro no login', { error: err.message });
      return next(err);
    }
    if (!user) {
      logger.warn('Falha de autenticação', { username: req.body.username, info: info ? info.message : 'Sem informação adicional' });
      return res.status(401).json({ erro: info ? info.message : 'Falha na autenticação' });
    }

    const payload = {
      id: user._id, 
      username: user.username,
      nome: user.nome,
      email: user.email,
      role: user.role,
      sub: 'EngWeb2025-GP15-API' 
    };

    const token = jwt.sign(
      payload,
      'EngWeb2025-GP15-SecretKey', 
      { expiresIn: '1h' } 
    );

    const userToReturn = { ...user.toObject() };
    delete userToReturn.hash;
    delete userToReturn.salt;

    return res.json({ mensagem: 'Login efetuado com sucesso', token: token, user: userToReturn });

  })(req, res, next);
};