const sistema = require('../controllers/sistema.js');
module.exports = (application) => {
	application.get('/dashboard',(req,res) => sistema.viewSistema(application,req,res));
	application.get('/sair',(req,res) => sistema.sair(application,req,res));
	application.get('/cadastrar-usuario', (req,res) => sistema.viewCriarUsuario(application,req,res));
	application.post('/cadastrar-usuario', (req,res) => sistema.criarUsuario(application,req,res));
};