import { createServer } from 'http'
import axios from 'axios'
import { genIntervPage, genMainPage, genMarcasPage } from './aux.js'
import { genRepPage } from './aux.js'
import fs from 'fs'

createServer(function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.write(genMainPage(d))
        res.end()

    } else if(req.url == '/reps'){
        axios.get('http://localhost:3000/reparacoes')
            .then(function(resp){
                var reps = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(genRepPage(reps, d, null))
                res.end()
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
            })       
    }
    else if(req.url == '/intervs'){
        axios.get('http://localhost:3000/tipos_intervencao')
        .then(function(resp){
            var intervs = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genIntervPage(intervs, d))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url == '/marcas'){
        axios.get('http://localhost:3000/marcas')
        .then(function(resp){
            var marcas = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genMarcasPage(marcas, d))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url.match(/\/marca\/[a-zA-Z%0-9]+$/)){
        var marca = req.url.split('/')[2]
        marca = marca.replace(/%20/g, ' ')
        axios.get('http://localhost:3000/reparacoes?viatura.marca=' + marca)
        .then(function(resp){
            var reps = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genRepPage(reps, d, marca))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url.match(/w3\.css$/)){
        fs.readFile('w3.css', (err, data) => {
            if(err){
                res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro  w3.css ' + erro + '</p>')
            }else{
                res.writeHead(200, {'Content-Type' : 'text/css; charset=utf-8'})
                res.end(data)
        }})}


    else if(req.url.match(/favicon\.ico$/)){
        fs.readFile('icon.png', (err, data) => {
            if(err){
                res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
                res.end('<p>Erro na leitura do ficheiro  w3.css ' + erro + '</p>')
            }else{
                res.writeHead(200, {'Content-Type' : 'image/png'})
                res.end(data)
        }})
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write('<p>Pedido não suportado: ' + req.method + " " + req.url + '</p>')
        res.end()
    }
}).listen(1234)

console.log("Servidor à escuta na porta 1234")