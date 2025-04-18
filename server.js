const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const sequelize = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

// Carregar variáveis de ambiente
dotenv.config();

// Verificar variáveis de ambiente
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET);
console.log('🚪 PORT:', process.env.PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logs detalhados das requisições

// Conexão com PostgreSQL
sequelize.authenticate()
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
  .catch(err => console.error('❌ Erro ao conectar ao PostgreSQL:', err));

// Sincronizar modelos com o banco de dados
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Modelos sincronizados com o banco de dados'))
  .catch(err => console.error('❌ Erro ao sincronizar modelos:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API da Rede Social funcionando!' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
}); 