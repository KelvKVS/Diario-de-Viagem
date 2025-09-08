## 📘 API - Diário de Viagens
Este é um guia das rotas disponíveis para integração com o frontend. Todas as rotas seguem o padrão REST e usam JSON como formato de comunicação.

## 🔐 Auth (/api/auth)

# POST /register

Cria um novo usuário.
Body: { "name": "João", "email": "joao@email.com", "password": "123456" }

# POST /login
Realiza login e retorna um token JWT.
Body: { "email": "joao@email.com", "password": "123456" }

# POST /logout
Logout do usuário (autenticado).

# GET /verify-token
Verifica validade do token JWT (autenticado).

## 👤 Users (/api/users)

# POST /send-request
Envia uma solicitação de amizade.
Body: { "receiverId": "<id_do_destinatario>" }
(Token JWT obrigatório)

# POST /accept-request
Aceita uma solicitação de amizade.
Body: { "requesterId": "<id_de_quem_enviou>" }

# GET /friends/:userId
Lista amigos do usuário.

# GET /requests/:userId
Lista solicitações de amizade pendentes.

## 🌍 Trips (/api/trips)

# POST /
Cria uma nova viagem (upload de imagem permitido).
Body: FormData com campos name, isPublic, members[], e image.

# GET /
Lista todas as viagens.

# GET /:id
Busca detalhes de uma viagem específica.

# PUT /:id
Atualiza uma viagem (upload de nova imagem permitido).

# DELETE /:id
Exclui uma viagem.

# POST /:id/members
Adiciona membro a uma viagem.
Body: { "userId": "<id_do_usuario>" }

# DELETE /:id/members/:memberId
Remove um membro da viagem.

## 📝 Posts (/api/posts)
# ⚠️ Todas as rotas de post exigem autenticação!

# GET /:tripId/posts
Lista todos os posts de uma viagem.

# POST /:tripId/posts
Cria um novo post com imagens (até 5).
Body: FormData com text, date, location, usuario, images[].

# POST /posts/:postId/comments
Adiciona um comentário a um post.
Body: { "text": "Comentário", "usuario": "<id_usuario>" }

# DELETE /posts/:postId
Deleta um post.

## 🖼️ Images (/api/images/:filename)
# GET /:filename
Busca imagem pelo nome salvo (para uso direto na <img src> do frontend).

## 🛡️ Middleware
Todas as rotas protegidas exigem o envio do token JWT no header: Authorization: Bearer <seu_token>