# EngWeb2025-A104005 - TPC6

## Título
Gestão de Contratos

## Data
14 de Abril de 2025

## Autor  
- **Nome:** Tomás Araújo Santos 
- **Número:** 104005
- ![Foto do Autor](../extra/foto.jpeg)

## Resumo

### API (`routes/contratos.js`)
- Implementa uma API RESTful para a gestão de contratos, conectada ao MongoDB.
- Processa requisições `GET`, `POST`, `PUT` e `DELETE` para gerenciar os dados dos contratos.
- Funcionalidades:
  - `GET /contratos` → Retorna uma lista de todos os contratos.
  - `GET /contratos/:id` → Retorna os detalhes de um contrato específico.
  - `PUT /contratos/:id` → Atualiza os dados de um contrato específico.
  - `DELETE /contratos/:id` → Remove um contrato específico do banco de dados.
  - `GET /contratos/entidades` → Retorna uma lista de todas as entidades comunicantes.
  - `GET /contratos/tipos` → Retorna uma lista de todos os tipos de procedimento.
  - **Rotas com Queries:**
    - `GET /contratos?tipo=AAA` → Retorna os contratos filtrados pelo tipo de procedimento `AAA`.
    - `GET /contratos?entidade=BBB` → Retorna os contratos filtrados pela entidade comunicante `BBB`.

- Utiliza o modelo `Contrato` para interagir com o MongoDB.

### Frontend (`routes/front.js`)
- Implementa a interface do utilizador para a gestão de contratos.
- Usa `axios` para consumir a API em `http://localhost:5555/contratos`.
- Processa requisições `GET`, `POST`, `PUT` e `DELETE` para interagir com o utilizador:
  - `GET /front` → Exibe uma página HTML com a lista de contratos.
  - `GET /front/contratos/:id` → Exibe os detalhes de um contrato específico.
  - `GET /front/entidades` → Exibe uma lista de todas as entidades comunicantes.
  - `GET /front/tipos` → Exibe uma lista de todos os tipos de procedimento.
  - `GET /front/edit/:id` → Exibe um formulário para editar os dados de um contrato específico.
  - `POST /front/edit/:id` → Envia os dados atualizados para a API e edita o contrato.
  - `GET /front/delete/:id` → Remove um contrato específico e redireciona para a lista de contratos.

---

## Modelo e Controladores

### Modelo (`models/contrato.js`)
- Define o esquema do MongoDB para os contratos:
  - `_id` (Number): Identificador único do contrato.
  - `nAnuncio` (String): Número do anúncio.
  - `tipoprocedimento` (String): Tipo de procedimento.
  - `objectoContrato` (String): Objeto do contrato.
  - `dataPublicacao` (String): Data de publicação.
  - `dataCelebracaoContrato` (String): Data de celebração do contrato.
  - `precoContratual` (Number): Preço contratual.
  - `prazoExecucao` (Number): Prazo de execução.
  - `NIPC_entidade_comunicante` (Number): NIPC da entidade comunicante.
  - `entidade_comunicante` (String): Nome da entidade comunicante.
  - `fundamentacao` (String): Fundamentação do contrato.

### Controladores (`controllers/contrato.js`)
- Implementa a lógica de negócio para interagir com o MongoDB:
  - `getContratos()` → Retorna todos os contratos.
  - `getContratoById(id)` → Retorna os detalhes de um contrato específico.
  - `getContratosByEntidade(entidade)` → Retorna os contratos de uma entidade específica.
  - `getContratosByTipo(tipo)` → Retorna os contratos de um tipo específico.
  - `getEntidades()` → Retorna uma lista de todas as entidades comunicantes.
  - `getTipos()` → Retorna uma lista de todos os tipos de procedimento.
  - `update(updatedContrato, id)` → Atualiza os dados de um contrato específico.
  - `delete(id)` → Remove um contrato específico do banco de dados.

---

## Testes no Browser

### Frontend
- `http://localhost:5555/front` → Exibe a lista de contratos.
- `http://localhost:5555/front/contratos/:id` → Exibe os detalhes de um contrato específico.
- `http://localhost:5555/front/entidades` → Exibe a lista de entidades comunicantes.
- `http://localhost:5555/front/tipos` → Exibe a lista de tipos de procedimento.
- `http://localhost:5555/front/edit/:id` → Exibe o formulário de edição de um contrato.
- `http://localhost:5555/front/delete/:id` → Remove um contrato específico e redireciona para a lista de contratos.

### API
- `GET http://localhost:5555/contratos` → Retorna a lista de contratos em formato JSON.
- `GET http://localhost:5555/contratos/:id` → Retorna os detalhes de um contrato específico em formato JSON.
- `PUT http://localhost:5555/contratos/:id` → Atualiza os dados de um contrato específico (enviar JSON no corpo da requisição).
- `DELETE http://localhost:5555/contratos/:id` → Remove um contrato específico.
- `GET http://localhost:5555/contratos/entidades` → Retorna a lista de entidades comunicantes.
- `GET http://localhost:5555/contratos/tipos` → Retorna a lista de tipos de procedimento.
- **Rotas com Queries:**
  - `GET http://localhost:5555/contratos?tipo=AAA` → Retorna os contratos filtrados pelo tipo de procedimento `AAA`.
  - `GET http://localhost:5555/contratos?entidade=BBB` → Retorna os contratos filtrados pela entidade comunicante `BBB`.

---

## Resultados Obtidos

### API
- A API permite a gestão completa dos dados dos contratos, incluindo a criação, leitura, atualização e remoção.
- Os dados são armazenados no MongoDB, utilizando o modelo `Contrato`.

### Frontend
- O frontend fornece uma interface amigável para interagir com a API.
- Permite visualizar a lista de contratos, registrar novos contratos, editar dados existentes e remover contratos.

---

## Lista de Resultados
- [Código-fonte da API](routes/contratos.js)
- [Código-fonte do Frontend](routes/front.js)
- [Modelo do MongoDB](models/contrato.js)
- [Controladores](controllers/contrato.js)