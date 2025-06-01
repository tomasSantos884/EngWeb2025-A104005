document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('item-editor-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('processando formulário de edição...', form);
    const data = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      classificadores: form.classificadores.value.split(',').map(c => c.trim().toLowerCase()),
      visibilidade: form.publico.checked,
      componentes: {
        texto: form.texto.value,
      },
      metadados: {
        destino: form.destino?.value,
        duracaoDias: form.duracaoDias?.value,
        restaurante: form.restaurante?.value,
        prato: form.prato?.value,
        valor: form.valor?.value,
        categoria: form.categoria?.value,
        evento: form.evento?.value,
        local: form.local?.value
      }
    };

    const itemId = form.dataset.id;

    // Adiciona o token ao header Authorization
    const token = window.apiToken;
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(token);

    fetch(`http://localhost:3000/api/items/${itemId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) {
        alert('Guardado com sucesso!');
        window.location.href = document.referrer || '/';
      } else {
        alert('Erro ao guardar.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Erro de rede ao guardar.');
    });
  });
});