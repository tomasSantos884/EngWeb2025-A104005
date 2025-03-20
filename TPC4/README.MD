# EngWeb2025-A104005 - TPC4

## Título
Gestão de Filmes

## Data
9 de Março de 2025

## Autor  
- **Nome:** Tomás Araújo Santos 
- **Número:** 104005
- ![Foto do Autor](../extra/foto.jpeg)

## Resumo (`routes/index.js`)

- Cria um servidor HTTP utilizando Node.js e Express
- Usa `axios` para consumir a API do `json-server` em `http://localhost:3000`
- Processa requisições `GET` para várias rotas principais:
  - `/` → Retorna a página inicial
  - `/filmes` → Retorna uma página HTML com uma lista de filmes
  - `/edit/:id` → Retorna uma página HTML com um formulário para editar um filme específico
  - `/delete/:id` → Deleta um filme específico e redireciona para a lista de filmes
  - `/ator/:nome` → Retorna uma página HTML com uma lista de filmes de um ator específico
- Processa requisições `POST` para:
  - `/edit/:id` → Edita um filme específico
- Processa requisições `PUT` para:
  - `/edit/:id` → Edita um filme específico
- Processa requisições `DELETE` para:
  - `/delete/:id` → Deleta um filme específico
- Retorna `404 Not Found` para URLs inválidas
- Imprime no terminal o método HTTP e a URL da requisição para debug

## Testes no Browser
- `http://localhost:5555/` → Exibe a página inicial
- `http://localhost:5555/filmes` → Exibe a lista de filmes
- `http://localhost:5555/edit/:id` → Exibe o formulário de edição de um filme
- `http://localhost:5555/ator/:nome` → Exibe a lista de filmes de um ator específico

## Lista de Resultados
- [Código-fonte](routes/index.js)
- [Base de dados](cinema.json)