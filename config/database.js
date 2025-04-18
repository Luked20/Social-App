const sequelize = require('./sequelize');

// Testar a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

// Importar e configurar as associações
require('../models/associations');

// Sincronizar os modelos com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
  })
  .catch(err => {
    console.error('Erro ao sincronizar modelos:', err);
  });

module.exports = sequelize; 