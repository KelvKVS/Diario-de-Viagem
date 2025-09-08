# Diário de Viagem - Blog

## Como rodar o projeto

### 1. Instalar dependências

No diretório raiz do projeto, execute:

```bash
npm install && cd backend && npm install && cd ../frontend && npm install && cd ..
```

### 2. Iniciar o projeto

Use o comando abaixo para iniciar frontend e backend em modo de desenvolvimento:

```bash
npm run start:dev
```

## Rotas do Backend

### Autenticação

- `POST /api/auth/register`: Registra um novo usuário.
- `POST /api/auth/login`: Realiza o login de um usuário.
- `POST /api/auth/logout`: Realiza o logout de um usuário.
- `GET /api/auth/verify-token`: Verifica a validade de um token.

### Posts

- `GET /api/posts`: Retorna uma lista de posts com filtros opcionais.
- `POST /api/posts`: Cria um novo post.

### Viagens

- `POST /api/trips`: Cria uma nova viagem.
- `GET /api/trips`: Retorna uma lista de viagens.
- `POST /api/trips/:tripId/add-member`: Adiciona um membro a uma viagem.
- `GET /api/trips/my-trips`: Retorna as viagens do usuário autenticado.

### Comentários

- `GET /api/comments/:postId`: Retorna os comentários de um post específico.
- `POST /api/comments`: Cria um novo comentário.

## Dependências do Backend

- `bcryptjs`: Para hashing de senhas.
- `cors`: Para habilitar CORS.
- `dotenv`: Para gerenciar variáveis de ambiente.
- `express`: Framework web para criar APIs.
- `jsonwebtoken`: Para autenticação baseada em tokens.
- `mongoose`: ODM para interagir com o MongoDB.

## Como utilizar as rotas

1. Certifique-se de que o servidor backend está rodando.
2. Utilize ferramentas como Postman ou cURL para realizar requisições HTTP.
3. Para rotas protegidas, inclua o token JWT no cabeçalho `Authorization` no formato `Bearer <token>`.
