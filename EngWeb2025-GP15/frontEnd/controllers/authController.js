const axios = require('axios');

module.exports.loginUser = (username, password) => {
  return axios.post('http://localhost:3000/api/login', { username, password })
    .then(response => {
      // API successful login returns { mensagem, token, user }
      // The user object from the API now includes the 'role'
      return { success: true, token: response.data.token, user: response.data.user };
    })
    .catch(err => {
      const erro = err.response?.data?.erro || 'Erro desconhecido ao tentar fazer login.';
      console.error('Login API error:', erro);
      return { success: false, erro: erro };
    });
};


module.exports.registerUser = (username, password, nome, email) => {
  return axios.post('http://localhost:3000/api/register', { username, password, nome, email })
    .then(response => {
      return { success: true, token: response.data.token, user: response.data.user };
    })
    .catch(err => {
      const erro = err.response?.data?.erro || 'Erro desconhecido ao tentar registar.';
      console.error('Register API error:', erro);
      return { success: false, erro: erro };
    });
};