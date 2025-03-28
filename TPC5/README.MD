# EngWeb2025-A104005 - TPC5

## Título
Gestão de Alunos

## Data
17 de Março de 2025

## Autor  
- **Nome:** Tomás Araújo Santos 
- **Número:** 104005
- ![Foto do Autor](../extra/foto.jpeg)

## Resumo

### API (`routes/alunos.js`)
- Implementa uma API RESTful para a gestão de alunos, conectada ao MongoDB.
- Processa requisições `GET`, `POST`, `PUT` e `DELETE` para gerenciar os dados dos alunos.
- Funcionalidades:
  - `GET /alunos` → Retorna uma lista de todos os alunos.
  - `GET /alunos/:id` → Retorna os detalhes de um aluno específico.
  - `POST /alunos` → Adiciona um novo aluno ao banco de dados.
  - `PUT /alunos/:id` → Atualiza os dados de um aluno específico.
  - `DELETE /alunos/:id` → Remove um aluno específico do banco de dados.
- Utiliza o modelo `Aluno` para interagir com o MongoDB.

### Frontend (`routes/front.js`)
- Implementa a interface do utilizador para a gestão de alunos.
- Usa `axios` para consumir a API em `http://localhost:5555/alunos`.
- Processa requisições `GET` e `POST` para interagir com o utilizador:
  - `GET /front` → Exibe uma página HTML com a lista de alunos.
  - `GET /front/registo` → Exibe um formulário para registrar um novo aluno.
  - `POST /front/registo` → Envia os dados do formulário para a API e registra um novo aluno.
  - `GET /front/edit/:id` → Exibe um formulário para editar os dados de um aluno específico.
  - `POST /front/edit/:id` → Envia os dados atualizados para a API e edita o aluno.
  - `GET /front/delete/:id` → Remove um aluno específico e redireciona para a lista de alunos.

---

## Modelo e Controladores

### Modelo (`models/aluno.js`)
- Define o esquema do MongoDB para os alunos:
  - `_id` (String): Identificador único do aluno.
  - `nome` (String): Nome do aluno.
  - `gitlink` (String): Link para o repositório Git do aluno.
  - `tpc1` a `tpc8` (Boolean): Indica se o aluno completou os Trabalhos Práticos Computacionais (TPCs).

### Controladores (`controllers/aluno.js`)
- Implementa a lógica de negócio para interagir com o MongoDB:
  - `getAlunos()` → Retorna todos os alunos.
  - `getAlunoByID(id)` → Retorna os detalhes de um aluno específico.
  - `insertAluno(alunoData)` → Adiciona um novo aluno ao banco de dados.
  - `update(alunoData, id)` → Atualiza os dados de um aluno específico.
  - `remove(id)` → Remove um aluno específico do banco de dados.

---

## Testes no Browser

### Frontend
- `http://localhost:5555/front` → Exibe a lista de alunos.
- `http://localhost:5555/front/registo` → Exibe o formulário de registro de um novo aluno.
- `http://localhost:5555/front/edit/:id` → Exibe o formulário de edição de um aluno.
- `http://localhost:5555/front/delete/:id` → Remove um aluno específico e redireciona para a lista de alunos.

### API
- `GET http://localhost:5555/alunos` → Retorna a lista de alunos em formato JSON.
- `GET http://localhost:5555/alunos/:id` → Retorna os detalhes de um aluno específico em formato JSON.
- `POST http://localhost:5555/alunos` → Adiciona um novo aluno (enviar JSON no corpo da requisição).
- `PUT http://localhost:5555/alunos/:id` → Atualiza os dados de um aluno específico (enviar JSON no corpo da requisição).
- `DELETE http://localhost:5555/alunos/:id` → Remove um aluno específico.

---

## Resultados Obtidos

### API
- A API permite a gestão completa dos dados dos alunos, incluindo a criação, leitura, atualização e remoção.
- Os dados são armazenados no MongoDB, utilizando o modelo `Aluno`.

### Frontend
- O frontend fornece uma interface amigável para interagir com a API.
- Permite visualizar a lista de alunos, registrar novos alunos, editar dados existentes e remover alunos.

---

## Lista de Resultados
- [Código-fonte da API](routes/alunos.js)
- [Código-fonte do Frontend](routes/front.js)
- [Modelo do MongoDB](models/aluno.js)
- [Controladores](controllers/aluno.js)
- [Base de dados](alunos.json)