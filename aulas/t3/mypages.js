// mypages.js
// 2025-02-17 by jcr
// HTML templates generating functions

export function genMainPage(data){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Oficina Automóvel</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Consultas</h1>
                </header>

                <div class="w3-container">
                    <ul class="w3-ul">
                        <li>
                            <a href="/reps">Lista de Reparações</a>
                        </li>
                        <li>
                            <a href="#">Lista de Tipos de Reparação</a>
                        </li>
                        <li>
                            <a href="#">Lista de Marcas</a>
                        </li>
                    </ul>
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

export function genRepPage(lreps, data){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <title>Oficina Automóvel</title>
            <link rel="stylesheet" type="text/css" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h1>Lista de Reparações</h1>
                </header>

                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>IdRep</th>
                            <th>Nome</th>
                            <th>Data</th>
                            <th>#Intervenções</th>
                        </tr>`
    lreps.forEach(rep => {
        pagHTML += `
        <tr>
            <td></td>
            <td>${rep.nome}</td>
            <td>${rep.data}</td>
            <td>${rep.nr_intervencoes}</td>
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

