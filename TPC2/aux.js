exports.myDateTime = () => {
    return new Date().toISOString().substring(0, 16)
}

exports.myName = function(){
    return "tomas"
}

exports.turma = 'EngWeb2025::tp2'

exports.genMainPage = (d) => {
    var page = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Escola de música</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class = "w3-card-4">
                <header class="w3-container w3-blue">
                    <h1>Consultas</h1>
                </header>
                

                <div class="w3-container">
                    <ul class = "w3-ul">
                        <li>
                            <a href="/alunos">Lista de alunos</a>
                        </li>

                        <li>
                            <a href="/cursos">Lista de cursos</a>
                        </li>

                        <li>
                            <a href="/instrumentos">Lista de instrumentos</a>
                        </li>
                    </ul>
                </div>
                
                <footer class="w3-container w3-blue">
                    <h5>Generated in class EngWeb2025 ${d}</h5>
                </footer>
            </div>
            
        </body>
    </html>`

    return page
}


exports.genAlunosPage = (alunos,data,aluno) => {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Escola de música</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Lista de Alunos${aluno==null? '':' - ' + aluno}</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>IdAluno</th>
                            <th>Nome</th>
                            <th>Data de Nascimento</th>
                            <th>Curso</th>
                            <th>Ano curso</th>
                            <th>Instrumento</th>
                        </tr>`
    alunos.forEach(aluno => {
        pagHTML += `
        <tr>
            <td><a href = '/alunos/${aluno.id}'>${aluno.id}</a></td>
            <td>${aluno.nome}</td>
            <td>${aluno.dataNasc}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.anoCurso}</td>
            <td>${aluno.instrumento}</td>
        </tr>
        `
    });

    pagHTML += `  
                    </table>
                </div>
                
                <footer class="w3-container w3-purple">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML

}

exports.genCursosPage = (cursos,data) => {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Escola de música</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Lista de Cursos</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>ID Curso</th>
                            <th>Designação</th>
                            <th>Duração</th>
                            <th>Instrumento</th>
                        </tr>`
    cursos.forEach(curso => {
        pagHTML += `
        <tr>
            <td><a href = '/cursos/${curso.id}'>${curso.id}</a></td>
            <td>${curso.designacao}</td>
            <td>${curso.duracao}</td>
            <td>${curso.instrumento.id}</td>
        </tr>
        `
    });

    pagHTML += `  
                    </table>
                </div>
                
                <footer class="w3-container w3-purple">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML

}

exports.genInstrumentosPage = (instrumentos, data) => {
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Escola de música</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-orange">
                    <h1>Lista de Instrumentos</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                        </tr>`
    
    instrumentos.forEach(instr => {
        pagHTML += `
            <tr>
                <td>${instr.id}</td>
                <td><a href = '/instrumentos/${instr["#text"]}'>${instr["#text"]}</a></td>
            </tr>`
    });

    pagHTML += `  
                    </table>
                </div>
                
                <footer class="w3-container w3-orange">
                    <h5>Generated in EngWeb2025 ${data}</h5>
                </footer>
            </div>
        </body>
    </html>
    `
    return pagHTML;
}
