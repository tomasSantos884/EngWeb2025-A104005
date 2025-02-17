# EngWeb2025-A104005 - TPC1


## Título
A oficina

## Data
16 de Fevereiro de 2025

## Autor  
- **Nome:** Tomás Araújo Santos 
- **Número:** 104005
- ![Foto do Autor](../extra/foto.jpeg)

## Resumo (`server.js`)

- Cria um servidor HTTP utilizando Node.js
- Ouve requisições na porta `1234`
- Usa `axios` para consumir a API do `json-server` em `http://localhost:3001/reparacoes`
- Processa requisições `GET` para duas rotas principais:
  - `/reparacoes` → Retorna uma página HTML com uma tabela de reparações
  - `/marcas` → Retorna uma página HTML com uma lista de marcas de viaturas (sem repetições)
- Trata erros caso a API esteja indisponível
- Retorna `404 Not Found` para URLs inválidas
- Retorna `405 Method Not Allowed` para métodos HTTP diferentes de `GET`
- Imprime no terminal o método HTTP e a URL da requisição para debug

## Testes no Browser
- `http://localhost:1234/reparacoes` → Exibe a lista de reparações
- `http://localhost:1234/marcas` → Exibe a lista de marcas

## Lista de Resultados
- [Código-fonte](server.js)
- [Base de dados](db.json)
