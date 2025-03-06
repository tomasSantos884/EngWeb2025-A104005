# EngWeb2025-A104005 - TPC3

## Título
Gestão de Alunos

## Data
2 de Março de 2025

## Autor  
- **Nome:** Tomás Araújo Santos 
- **Número:** 104005
- ![Foto do Autor](../extra/foto.jpeg)

## Resumo (`alunos_server_skeleton.js`)

- Cria um servidor HTTP utilizando Node.js
- Ouve requisições na porta `7777`
- Usa `axios` para consumir a API do `json-server` em `http://localhost:3000`
- Processa requisições `GET` para várias rotas principais:
  - `/` ou `/alunos` → Retorna uma página HTML com uma lista de alunos
  - `/alunos/:id` → Retorna uma página HTML com detalhes de um aluno específico
  - `/alunos/registo` → Retorna uma página HTML com um formulário para registrar um novo aluno
  - `/alunos/edit/:id` → Retorna uma página HTML com um formulário para editar um aluno específico
  - `/alunos/delete/:id` → Deleta um aluno específico e retorna uma mensagem de confirmação
- Processa requisições `POST` para:
  - `/alunos/registo` → Registra um novo aluno
  - `/alunos/edit/:id` → Edita um aluno específico
- Processa requisições `PUT` para:
  - `/alunos/edit/:id` → Edita um aluno específico
- Retorna `404 Not Found` para URLs inválidas
- Imprime no terminal o método HTTP e a URL da requisição para debug

## Testes no Browser
- `http://localhost:7777/alunos` → Exibe a lista de alunos
- `http://localhost:7777/alunos/registo` → Exibe o formulário de registro de aluno

## Lista de Resultados
- [Código-fonte](alunos_server_skeleton.js)
- [Base de dados](csvjson.json)