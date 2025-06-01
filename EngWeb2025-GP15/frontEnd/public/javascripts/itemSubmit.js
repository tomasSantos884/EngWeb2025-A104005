document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('item-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();


      const classificadores = form.classificadores.value.split(',').map(x => x.trim()).filter(x => x);
      if (classificadores.length === 0) {
        alert('Por favor, insira pelo menos um classificador.');
        document.getElementById('classificadorInput').focus();
        return; // Impede o envio!
      }

    const zip = new JSZip();

    const getValue = name => form[name]?.value?.trim() || '';

    const componentes = {
      texto: getValue('texto'),
      ficheiros: [...form.ficheiros.files].map(f => f.name)
    };

    console.log('hyperlinks:', componentes.hyperlinks);

    const tipo = form.tipoRecurso.value;
    const manifest = {
      titulo: getValue('titulo'),
      descricao: getValue('descricao'),
      dataCriacao: new Date().toISOString(),
      dataSubmissao: new Date().toISOString(),
      tipoRecurso: tipo,
      classificadores: form.classificadores.value.split(',').map(x => x.trim().toLowerCase()),
      visibilidade: form.visibilidade.checked,
      produtor: window.loggedInUser || "anon",
      submissor: window.loggedInUser || "anon",
      componentes,

      destino: tipo === 'Viagens' ? getValue('destino') : '',
      duracaoDias: tipo === 'Viagens' ? parseInt(getValue('duracaoDias')) || 0 : undefined,
      restaurante: tipo === 'Gastronomia' ? getValue('restaurante') : '',
      prato: tipo === 'Gastronomia' ? getValue('prato') : '',
      valor: tipo === 'Despesas' ? parseFloat(getValue('valor')) || 0 : undefined,
      categoria: tipo === 'Despesas' ? getValue('categoria') : '',
      evento: tipo === 'Eventos' ? getValue('evento') : '',
      local: tipo === 'Eventos' ? getValue('local') : ''
    };

    zip.file('manifesto-SIP.json', JSON.stringify(manifest, null, 2));

    [...form.ficheiros.files].forEach(f => {
      zip.file(f.name, f);
    });


    zip.generateAsync({ type: 'blob' }).then(blob => {
      const formData = new FormData();
      formData.append('sipzip', blob, 'sip-package.zip');

       // Retrieve the token made available by the Pug template
      const token = window.apiToken; 
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    
      return fetch('http://localhost:3000/api/items', {
        method: 'POST',
        body: formData,
        headers: headers
      });
    })
    .then(res => {
      if (res.ok) {
        alert('Item enviado com sucesso!');
        window.location.replace(`/me/${window.loggedInUser}`); 
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json().then(erro => {
            alert('Erro ao enviar SIP: ' + (erro.erro || 'Erro desconhecido.'));
          });
        } else {
          return res.text().then(text => {
            alert('Erro ao enviar SIP. Resposta do servidor: ' + text);
          });
        }
      }
    })
    .catch(err => {
      alert('Erro inesperado: ' + err.message);
    });
  });
});