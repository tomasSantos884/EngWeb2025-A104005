import { createServer } from 'http'
import { myDateTime } from './aux.js'
import { parse } from 'url'

var myServer = createServer(function (req, res) {
    console.log(req.method + " " + req.url + " " + myDateTime())
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    var q = parse(req.url, true)
    res.write('True: <pre>' + JSON.stringify(q) + '</pre>')

    var q2 = parse(req.url, false)
    res.write('False: <pre>' + JSON.stringify(q2) + '</pre>')

    res.end()
})

myServer.listen(7777)
console.log("Servidor à escuta na porta 7777...")