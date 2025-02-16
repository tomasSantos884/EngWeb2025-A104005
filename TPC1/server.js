const http = require('http');
const axios = require('axios');

http.createServer(async (req, res) => {
    console.log("METHOD: " + req.method);
    console.log("URL: " + req.url);

    switch(req.method) {
        case "GET":
            switch(req.url) {
                case "/reparacoes":
                    try {
                        const response = await axios.get("http://localhost:3001/reparacoes");
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write('<h1>Lista de Reparações</h1>');
                        res.write('<table border="1"><tr><th>Data</th><th>NIF</th><th>Nome</th><th>Marca</th><th>Modelo</th><th>Número de Intervenções</th></tr>');
                        response.data.forEach(reparacao => {
                            res.write(`<tr>
                                <td>${reparacao.data}</td>
                                <td>${reparacao.nif}</td>
                                <td>${reparacao.nome}</td>
                                <td>${reparacao.viatura.marca}</td>
                                <td>${reparacao.viatura.modelo}</td>
                                <td>${reparacao.nr_intervencoes}</td>
                            </tr>`);
                        });
                        res.write('</table>');
                        res.end();
                    } catch (error) {
                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write('<p>Erro ao obter dados da API</p>');
                        res.end();
                    }
                    break;
                case "/marcas":
                    try{
                        const response = await axios.get("http://localhost:3001/reparacoes");
                        const marcas = new Set();
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write('<h1>Lista de Marcas</h1>');
                        res.write('<ul>');
                        response.data.forEach(reparacao => {
                            if(!marcas.has(reparacao.viatura.marca)){
                                marcas.add(reparacao.viatura.marca);
                                res.write(`<li>${reparacao.viatura.marca}</li>`);
                            }
                        });
                        res.write('</ul>');
                        res.end();
                    } catch (error) {
                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'});
                        res.write('<p>Erro ao obter dados da API</p>');
                        res.end();
                    }
                default:
                    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
                    res.end();
                    break;
            }
            break;
        default:
            res.writeHead(405, {'Content-Type': 'text/html;charset=utf-8'});
            res.end();
            break;
    }
}).listen(1234);

console.log("Servidor a escuta na porta 1234...");