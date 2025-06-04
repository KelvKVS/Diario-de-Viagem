# Diário de Viagem API Documentation

## Overview
The Diário de Viagem API is a RESTful service that provides endpoints for managing travel diaries, posts, comments, and user interactions.

## Base Information
- **Base URL**: `http://localhost:3000/api`
- **Content Type**: `application/json`
- **Authentication**: JWT Bearer Token
- **Rate Limit**: 100 requests/minute per IP

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### User Routes (`/api/users`)

#### Register User
```http
POST /api/users/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:** `201 Created`
```json
{
  "message": "Usuário registrado com sucesso",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/users/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
**Response:** `200 OK`
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Logout User
```http
POST /api/users/logout
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
{
  "message": "Logout realizado com sucesso"
}
```

#### Verify Token
```http
GET /api/users/verify-token
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
{
  "valid": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Protected User Info
```http
GET /api/users/usuarios-protegidos
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
{
  "message": "Bem-vindo, usuário user_id"
}
```

#### Test Route
```http
GET /api/users/test
```
**Response:** `200 OK`
```json
{
  "message": "Rota GET funcionando!"
}
```

### User Error Responses

#### 400 Bad Request
```json
{
  "error": "Usuário já existe"
}
```

#### 401 Unauthorized
```json
{
  "error": "Token não fornecido",
  "message": "É necessário fornecer um token de autenticação no formato Bearer"
}
```
or
```json
{
  "error": "Token expirado",
  "message": "Sua sessão expirou. Por favor, faça login novamente.",
  "expiredAt": "2024-03-20T10:00:00Z"
}
```
or
```json
{
  "error": "Token inválido",
  "message": "O token fornecido é inválido ou mal formatado"
}
```
or
```json
{
  "error": "Senha incorreta"
}
```

#### 404 Not Found
```json
{
  "error": "Usuário não encontrado"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Erro no registro",
  "details": "Error message details"
}
```
or
```json
{
  "error": "Erro no login",
  "details": "Error message details"
}
```
or
```json
{
  "error": "Erro interno no servidor",
  "details": "Error message details"
}
```

### User Data Model
```typescript
interface User {
  _id: string;
  name: string;
  photo?: string;
  email: string;
  password: string; // hashed
  friends: User[];
  friendRequests: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Usuário já existe"
}
```

### 401 Unauthorized
```json
{
  "message": "Senha incorreta"
}
```

### 404 Not Found
```json
{
  "message": "Usuário não encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Erro no registro"
}
```
or
```json
{
  "error": "Erro no login"
}
```

## Data Models

### User
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

## Best Practices
1. Always include the Authorization header for protected routes
2. Handle rate limiting by implementing exponential backoff
3. Use proper error handling for all API responses
4. Implement proper validation for all request bodies
5. Use pagination for list endpoints (limit and offset parameters)
6. Implement proper caching headers where appropriate
7. Use proper HTTP methods for each operation
8. Follow RESTful conventions for endpoint naming
9. Implement proper logging for debugging and monitoring
10. Use proper security headers and CORS configuration

### Trip Routes (`/api/trips`)

#### Create Trip
```http
POST /api/trips
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```
**Request Body:**
```json
{
  "name": "Summer Vacation",
  "description": "Trip to the beach",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T00:00:00Z",
  "isPublic": true,
  "coverImage": "file" // Optional image file
}
```
**Response:** `201 Created`
```json
{
  "_id": "trip_id",
  "name": "Summer Vacation",
  "description": "Trip to the beach",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T00:00:00Z",
  "isPublic": true,
  "coverImage": "/uploads/image.jpg",
  "members": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ],
  "admins": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ],
  "createdBy": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar_url"
  },
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

#### Get All Trips
```http
GET /api/trips
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 9)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)
- `isPublic` (optional): Filter public trips (default: true)
- `search` (optional): Search term for trip name

**Response:** `200 OK`
```json
{
  "trips": [
    {
      "_id": "trip_id",
      "name": "Summer Vacation",
      "description": "Trip to the beach",
      "startDate": "2024-07-01T00:00:00Z",
      "endDate": "2024-07-15T00:00:00Z",
      "isPublic": true,
      "coverImage": "/uploads/image.jpg",
      "members": [
        {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "avatar_url"
        }
      ],
      "admins": [
        {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "avatar_url"
        }
      ],
      "createdBy": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "avatar_url"
      }
    }
  ],
  "total": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

#### Get Trip by ID
```http
GET /api/trips/:id
```
**Response:** `200 OK`
```json
{
  "_id": "trip_id",
  "name": "Summer Vacation",
  "description": "Trip to the beach",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T00:00:00Z",
  "isPublic": true,
  "coverImage": "/uploads/image.jpg",
  "members": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ],
  "admins": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ],
  "createdBy": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar_url"
  }
}
```

#### Update Trip
```http
PUT /api/trips/:id
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```
**Request Body:**
```json
{
  "name": "Updated Trip Name",
  "description": "Updated description",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T00:00:00Z",
  "isPublic": true,
  "coverImage": "file" // Optional image file
}
```
**Response:** `200 OK`
```json
{
  "_id": "trip_id",
  "name": "Updated Trip Name",
  "description": "Updated description",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T00:00:00Z",
  "isPublic": true,
  "coverImage": "/uploads/new_image.jpg",
  "members": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ],
  "admins": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ],
  "createdBy": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar_url"
  }
}
```

#### Delete Trip
```http
DELETE /api/trips/:id
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
{
  "message": "Viagem excluída com sucesso"
}
```

#### Add Member to Trip
```http
POST /api/trips/:id/members
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Request Body:**
```json
{
  "userId": "user_id_to_add"
}
```
**Response:** `200 OK`
```json
{
  "_id": "trip_id",
  "name": "Summer Vacation",
  "members": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    },
    {
      "_id": "new_user_id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "avatar": "avatar_url"
    }
  ]
}
```

#### Remove Member from Trip
```http
DELETE /api/trips/:id/members/:memberId
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
{
  "_id": "trip_id",
  "name": "Summer Vacation",
  "members": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    }
  ]
}
```

### Trip Error Responses

#### 400 Bad Request
```json
{
  "error": "Dados inválidos",
  "details": ["Error message details"]
}
```

#### 401 Unauthorized
```json
{
  "error": "Usuário não autenticado"
}
```

#### 403 Forbidden
```json
{
  "error": "Acesso não autorizado"
}
```

#### 404 Not Found
```json
{
  "error": "Viagem não encontrada"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Erro ao criar viagem"
}
```
or
```json
{
  "error": "Erro ao buscar viagens"
}
```
or
```json
{
  "error": "Erro ao atualizar viagem"
}
```
or
```json
{
  "error": "Erro ao excluir viagem"
}
```
or
```json
{
  "error": "Erro ao adicionar membro"
}
```
or
```json
{
  "error": "Erro ao remover membro"
}
```

### Trip Data Model
```typescript
interface Trip {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  coverImage: string;
  isPublic: boolean;
  members: User[];
  admins: User[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post Routes (`/api/posts`)

#### Get Trip Posts
```http
GET /api/posts/:tripId/posts
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
[
  {
    "_id": "post_id",
    "trip": "trip_id",
    "author": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    },
    "title": "First Day at the Beach",
    "content": "Today we arrived at the beach...",
    "type": "text",
    "location": "Copacabana Beach",
    "images": ["image1.jpg", "image2.jpg"],
    "comments": [
      {
        "author": {
          "_id": "user_id",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "avatar": "avatar_url"
        },
        "content": "Great post!",
        "createdAt": "2024-03-20T10:00:00Z"
      }
    ],
    "createdAt": "2024-03-20T10:00:00Z",
    "updatedAt": "2024-03-20T10:00:00Z"
  }
]
```

#### Create Post
```http
POST /api/posts/:tripId/posts
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```
**Request Body:**
```json
{
  "title": "First Day at the Beach",
  "content": "Today we arrived at the beach...",
  "type": "text",
  "location": "Copacabana Beach",
  "images": ["file1", "file2"] // Optional image files (max 5 files, 5MB each)
}
```
**Response:** `201 Created`
```json
{
  "post": {
    "_id": "post_id",
    "trip": "trip_id",
    "author": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    },
    "title": "First Day at the Beach",
    "content": "Today we arrived at the beach...",
    "type": "text",
    "location": "Copacabana Beach",
    "images": ["image1.jpg", "image2.jpg"],
    "comments": [],
    "createdAt": "2024-03-20T10:00:00Z",
    "updatedAt": "2024-03-20T10:00:00Z"
  }
}
```

#### Add Comment to Post
```http
POST /api/posts/posts/:postId/comments
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Request Body:**
```json
{
  "content": "Great post!"
}
```
**Response:** `200 OK`
```json
{
  "_id": "post_id",
  "trip": "trip_id",
  "author": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar_url"
  },
  "title": "First Day at the Beach",
  "content": "Today we arrived at the beach...",
  "type": "text",
  "location": "Copacabana Beach",
  "images": ["image1.jpg", "image2.jpg"],
  "comments": [
    {
      "author": {
        "_id": "user_id",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "avatar": "avatar_url"
      },
      "content": "Great post!",
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ],
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

#### Delete Post
```http
DELETE /api/posts/posts/:postId
```
**Headers:**
```http
Authorization: Bearer <your_jwt_token>
```
**Response:** `200 OK`
```json
{
  "message": "Post deletado com sucesso"
}
```

### Post Error Responses

#### 400 Bad Request
```json
{
  "error": "Dados inválidos"
}
```

#### 401 Unauthorized
```json
{
  "error": "Usuário não autenticado"
}
```

#### 403 Forbidden
```json
{
  "error": "Você não é membro desta viagem"
}
```
or
```json
{
  "error": "Não autorizado a deletar este post"
}
```

#### 404 Not Found
```json
{
  "error": "Viagem não encontrada"
}
```
or
```json
{
  "error": "Post não encontrado"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Erro ao criar post"
}
```
or
```json
{
  "error": "Erro ao buscar posts"
}
```
or
```json
{
  "error": "Erro ao adicionar comentário"
}
```
or
```json
{
  "error": "Erro ao deletar post"
}
```

### Post Data Model
```typescript
interface Post {
  _id: string;
  trip: string; // Trip ID
  author: User;
  title: string;
  content: string;
  type: 'text' | 'location';
  location?: string;
  images: string[];
  comments: {
    author: User;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Image Routes (`/api/images`)

#### Get Image
```http
GET /api/images/:filename
```
**Response:** `200 OK`
- Returns the image file directly
- Content-Type will be set according to the image type (e.g., image/jpeg, image/png)

#### Image Upload Specifications
Images can be uploaded through the following endpoints:
- Trip cover image: `POST /api/trips` and `PUT /api/trips/:id`
- Post images: `POST /api/posts/:tripId/posts`

**File Requirements:**
- Maximum file size: 5MB
- Allowed formats: JPG, JPEG, PNG, GIF
- Maximum number of files per post: 5
- Maximum number of files per trip cover: 1

**Headers for Upload:**
```http
Content-Type: multipart/form-data
Authorization: Bearer <your_jwt_token>
```

**Example Upload Form Data:**
```json
{
  "coverImage": "file", // For trip cover
  "images": ["file1", "file2"], // For post images
  "otherData": "value"
}
```

### Image Error Responses

#### 400 Bad Request
```json
{
  "error": "Apenas arquivos de imagem são permitidos!"
}
```
or
```json
{
  "error": "Arquivo muito grande. Tamanho máximo permitido: 5MB"
}
```

#### 404 Not Found
```json
{
  "error": "Imagem não encontrada"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Erro ao verificar arquivo"
}
```
or
```json
{
  "error": "Erro ao processar upload"
}
```

### Image Data Model
```typescript
interface Image {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: Date;
}
```

### Image Storage
- Images are stored in the `/uploads` directory
- File names are generated using a unique timestamp and random number
- Original file extensions are preserved
- Files are served statically through the `/uploads` endpoint

### CORS Configuration
The image endpoints are configured with CORS headers:
```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```
