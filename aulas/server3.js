const http = require('http')
const meta = require('./aux')

http.createServer((req, res) => {
    console.log("METHOD: " + req.method)
    console.log("URL: " + req.url)

    switch(req.method){

    
        case "GET":

            switch(req.url){
                case "/data" : 
                    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write('<p>Olá turma de 2025!</p>')

                    res.write(meta.myDateTime())
                    break;
                case "/nome" : 
                    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write('<p>Olá turma de 2025!</p>')

                    res.write(meta.myName())
                    break;
                case "/turma" : 
                    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write('<p>Olá turma de 2025!</p>')

                    res.write(meta.turma)
                    break;
                default : 
                    res.writeHead(404, {'Content-Type' : 'text/html;charset=utf-8'})
                    break;
            }

            res.end()
            break;
        
        default:
            res.writeHead(405, {'Content-Type' : 'text/html;charset=utf-8'})
            break;
    }
}).listen(1234)

console.log("Servidor a escuta na porta 1234...")