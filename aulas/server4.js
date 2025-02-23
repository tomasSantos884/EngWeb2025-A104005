const http = require('http')
const axios = require('axios')
const meta = require('./aux')

http.createServer((req, res) => {
    console.log("METHOD: " + req.method)
    console.log("URL: " + req.url)

    switch(req.method){

    
        case "GET":

            switch(req.url){
                case "/cidades" : 
                
                    axios.get('http://localhost:3000/cidades?_sort=nome')
                        .then(resp => {
                            var cidades = resp.data
                            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                            res.write("<h1>Cidades</h1>")
                            res.write("<ul>")
                            cidades.forEach(element => {
                                res.write(`<li><a href='/cidades/${element.id}'>${element.nome}</a></li>`)
                            
                            });
                            res.write("</ul>")

                            res.end()
                        })
                        .catch(err => {
                            res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
                            console.log(err)
                            res.end()
                        })
                if (req.url.match(/\/cidades\/.+/)) {
                    var id = req.url.split("/")[1]
                    axios.get('http://localhost:3000/cidades/${id}')
                    .then(resp => {
                        var cidades = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write("<h1>${cidade.nome}</h1>")
                        res.write(<pre>JSON.stringify(cidade)</pre>)
                        res.write('<h6><a href="/cidades">Voltar</a></h6>')

                        res.end()
                    })
                    .catch(err => {
                        res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
                        console.log(err)
                        res.end()
                    })
                }

                    break;
                case "/ligacoes" : 
                    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write('<p>Olá turma de 2025!</p>')

                    res.write(meta.myName())

                    res.end()
                    break;
                default : 
                    res.writeHead(404, {'Content-Type' : 'text/html;charset=utf-8'})

                    res.end()
                    break;
            }

            break;
        
        default:
            res.writeHead(405, {'Content-Type' : 'text/html;charset=utf-8'})
            break;
    }
}).listen(1234)

console.log("Servidor a escuta na porta 1234...")