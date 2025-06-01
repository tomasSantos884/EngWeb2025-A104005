const axios = require('axios');


module.exports.getItems = (userId,token) => {
  return axios.get(`http://localhost:3000/api/items/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(response => ({ success: true, items: response.data }))
    .catch(err => {
      const erro = err.response?.data?.erro || 'Erro desconhecido ao buscar itens.';
      return { success: false, erro };
    });}

module.exports.addItem = (userId, name, description) => {
  return axios.post(`http://localhost:3000/api/items/${userId}`, { name, description })
    .then(response => ({ success: true, item: response.data.item }))
    .catch(err => {
      const erro = err.response?.data?.erro || 'Erro desconhecido ao adicionar item.';
      return { success: false, erro };
    });
};



module.exports.getPublicItems = () => {
  return axios.get('http://localhost:3000/api/public/items')
    .then(response => ({ success: true, items: response.data }))
    .catch(err => {
      const erro = err.response?.data?.erro || 'Erro desconhecido ao buscar itens públicos.';
      return { success: false, erro };
    });
}