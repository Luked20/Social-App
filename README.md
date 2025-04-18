# Clone Social

Um clone simplificado de rede social com recursos básicos.

## Funcionalidades

- Cadastro e autenticação de usuários
- Criação de posts
- Feed de posts
- Perfil de usuário
- Seguir/Deixar de seguir usuários

## Tecnologias Utilizadas

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - JWT para autenticação

- Frontend:
  - React
  - React Router
  - Axios

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd clone-social
```

2. Instale as dependências do backend:
```bash
npm install
```

3. Instale as dependências do frontend:
```bash
cd client
npm install
```

4. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clone-social
JWT_SECRET=seu_segredo_super_secreto
```

## Executando o Projeto

1. Inicie o servidor backend:
```bash
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd client
npm start
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:5000`.

## Estrutura do Projeto

```
clone-social/
├── client/                 # Frontend React
├── server.js              # Ponto de entrada do servidor
├── package.json           # Dependências do backend
└── README.md             # Este arquivo
``` 
