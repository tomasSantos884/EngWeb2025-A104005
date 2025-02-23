import { createServer } from 'http'
import axios from 'axios'
import { genCursosPage, genMainPage, genInstrumentosPage } from './aux.js'
import { genAlunosPage } from './aux.js'
import fs from 'fs'

createServer(function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if (req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.write(genMainPage(d))
        res.end()

    } else if(req.url == '/alunos'){
        axios.get('http://localhost:3001/alunos')
            .then(function(resp){
                var alunos = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(genAlunosPage(alunos, d, null))
                res.end()
            })
            .catch(erro => {
                console.log("Erro: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
            })       
    }
    else if(req.url == '/cursos'){
        axios.get('http://localhost:3001/cursos')
        .then(function(resp){
            var cursos = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genCursosPage(cursos, d))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url == '/instrumentos'){
        axios.get('http://localhost:3001/instrumentos')
        .then(function(resp){
            var instrumentos = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genInstrumentosPage(instrumentos, d))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url.match(/\/cursos\/[a-zA-Z%0-9]+$/)){
        var curso = req.url.split('/')[2]
        curso = curso.replace(/%20/g, ' ')
        axios.get('http://localhost:3001/alunos?curso=' + curso)
        .then(function(resp){
            var alunos = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genAlunosPage(alunos, d, null))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url.match(/\/instrumentos\/[a-zA-Z%0-9]+$/)){
        var instrumento = req.url.split('/')[2]
        instrumento = instrumento.replace(/%20/g, ' ')
        axios.get('http://localhost:3001/alunos?instrumento=' + instrumento)
        .then(function(resp){
            var alunos = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genAlunosPage(alunos, d, null))
            res.end()
        })
        .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Erro na obtenção de dados: ' + erro + '</p>')
        })
    }

    else if(req.url.match(/\/cursos\/[a-zA-Z%0-9]+$/)){
        var aluno = req.url.split('/')[2]
        aluno = aluno.replace(/%20/g, ' ')
        axios.get('http://localhost:3001/alunos?id=' + aluno)
        .then(function(resp){
            var alunos = resp.data
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(genAlunosPage(alunos, d, aluno))
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