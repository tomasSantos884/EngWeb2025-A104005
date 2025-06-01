const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');



const userSchema = new mongoose.Schema({
  nome: { type: String },
  email: { type: String, required: true, unique: true },
  dataRegisto: { type: Date, default: Date.now },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username',
    errorMessages: { // Mensagens de error personalizadas
        UserExistsError: 'Já existe um utilizador com este username.',
        MissingPasswordError: 'Password não fornecida.',
        AttemptTooSoonError: 'Conta bloqueada temporariamente. Tente mais tarde.',
        TooManyAttemptsError: 'Demasiadas tentativas de login. Conta bloqueada.',
        NoSaltValueStoredError: 'Erro de autenticação. Salt não encontrado.',
        IncorrectPasswordError: 'Password ou username incorreto.',
        IncorrectUsernameError: 'Password ou username incorreto.',
        MissingUsernameError: 'Username não fornecido.',
    }
});


module.exports = mongoose.model('User', userSchema);
