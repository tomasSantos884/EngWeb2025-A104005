import {createServer} from 'http';

createServer(function (req,res){
    res.writeHead(200, {'Content-Type': 'text/plan; charset=utf-8'});
    res.end('Olá!')
}).listen(7777);

console.log("Servidor à escuta port 7777");