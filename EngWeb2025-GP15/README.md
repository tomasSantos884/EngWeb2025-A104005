# EuDigital - Diário Digital Pessoal

Este projeto é um sistema de Diário Digital Pessoal, inspirado na norma OAIS, que permite a criação, gestão e preservação de pacotes de informação SIP, AIP e DIP. Inclui funcionalidades de login/autenticação, ingestão de pacotes, editor de itens com upload de ficheiros, comentários e geração de estatísticas de utilização.

---

## Decisões de Desenvolvimento


- **Schema Flexível:**  
  Não fizemos separação rígida dos tipos de recursos no schema dos items, tornando o sistema mais flexível e fácil de escalar. A validação dos dados dos pacotes SIP é assumida do lado do utilizador, libertando o servidor dessa carga.
- **IDs Automáticos:**  
  O MongoDB gere automaticamente os IDs dos documentos, evitando a necessidade de gestão manual de identificadores.
- **Classificadores Livres:**  
  Não definimos uma taxonomia fixa para os classificadores. O utilizador pode criar e usar os classificadores que quiser, permitindo filtragem flexível dos items posteriormente.

---

## Tipos de Items e Metadados

É possível criar 5 tipos principais de items, cada um com metadados específicos:

- **Viagens:**  
  - Metadados: destino, duração
- **Despesas:**  
  - Metadados: montante, categoria
- **Journaling:**  
  - Metadados: texto livre
- **Eventos:**  
  - Metadados: local, nome
- **Gastronomia:**  
  - Metadados: restaurante, prato

---

## Estatísticas Calculadas

Com base nos items e respetivos metadados, são geradas estatísticas como:

- Número total de dias em viagem
- Lista de destinos visitados
- Total de despesas e categoria onde foi gasto mais dinheiro
- Lista de restaurantes visitados
- Lista de eventos registados

---

## Funcionalidades Principais

- Ingestão de SIP (Submission Information Package) via upload de ZIP
- Criação de AIP (Archival Information Package) com organização por ano/mês
- Geração de DIP (Dissemination Information Package) para download
- Editor online de itens (título, descrição, metadados, classificadores, imagens, ficheiros)
- Sistema de autenticação (login e registo de utilizadores)
- CRUD: Adicionar, editar, apagar itens
- Filtro e ordenação por classificadores, tipo de recurso e data
- Logs e Estatísticas: Registo de visualizações e downloads
- Administração com visualização de estatísticas
- Partilha de itens através da Web Share API
- Comentários nos itens
- Upload/Download de ficheiros e imagens associadas

---

## Tecnologias Utilizadas

- **Frontend:**  
  - Pug.js (templates)
  - HTML5, CSS3
  - JavaScript (ES6+)
- **Backend:**  
  - Node.js, Express.js
  - MongoDB, Mongoose
- **Autenticação:**  
  - Passport.js (local strategy)
- **Uploads:**  
  - Multer
- **Outros:**  
  - archiver (Geração de ZIP)
  - Ajv (validação de manifestos)
  - Winston/Morgan (logs)

---

## Instalação e Configuração

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Inicializar a base de dados com o utilizador público (via Postman ou MongoDB shell):
   ```json
   {
     "username": "public",
     "nome": "Utilizador Público",
     "email": "public@email.com",
     "password": "public",
     "role": "user"
   }
   ```

3. Iniciar o servidor backend (API):
   ```bash
   npm start
   ```
   Servidor disponível em:  
   `http://localhost:3000`

4. Iniciar o frontend (num terminal separado, dentro da pasta `frontEnd`):
   ```bash
   npm start
   ```
   Frontend disponível em:  
   `http://localhost:3001`

---

## Estrutura de Pastas

```
api/
  controllers/
  models/
  routes/
  uploads/          # Ficheiros e pacotes armazenados
  logs/             # Logs de ações

frontEnd/
  views/            # Templates Pug
  routes/           # Rotas Express do frontend
  public/           # JS, CSS, imagens
  javascripts/      # Scripts do frontend
```

---

## Endpoints Principais

### Autenticação
- `POST /api/register` — Criar utilizador
- `POST /api/login` — Login

### Itens
- `POST /api/items` — Upload de SIP (ZIP)
- `GET /api/items/:id` — Obter item por ID
- `PUT /api/items/:id` — Atualizar item
- `DELETE /api/items/:id` — Apagar item
- `GET /api/items/dip/:id` — Gerar DIP (ZIP para download)
- `GET /api/public/items` — Listar itens públicos
- `GET /api/items/user/:userId` — Listar itens de um utilizador

### Ficheiros
- `POST /api/files/:id` — Upload de ficheiro/foto para item
- `GET /api/files/:filePath(*)` — Download de ficheiro (por path relativo)
- `DELETE /api/files/:id/:filename` — Apagar ficheiro de item

### Comentários
- `POST /api/comments` — Adicionar comentário a item
- `GET /api/comments/:itemId` — Listar comentários de um item

### Utilizadores
- `GET /api/users` — Listar utilizadores (admin)
- `GET /api/users/:id/stats` — Estatísticas de utilização do utilizador
- `PUT /api/users/:id` — Atualizar utilizador
- `DELETE /api/users/:id` — Apagar utilizador

### Logs / Estatísticas
- `GET /api/logs/views` — Visualizações
- `GET /api/logs/downloads` — Downloads




## Notas Finais

Este projeto é uma implementação prática de um Diário Digital Pessoal, inspirado pelas boas práticas do modelo OAIS, garantindo ingestão, preservação e disseminação da informação digital.