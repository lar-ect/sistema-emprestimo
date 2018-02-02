const sistema = require('../controllers/sistema.js');
module.exports = (application) => {
	application.get('/dashboard',(req,res) => sistema.viewSistema(application,req,res));
	application.get('/sair',(req,res) => sistema.sair(application,req,res));
	application.get('/cadastrar-usuario', (req,res) => sistema.viewCriarUsuario(application,req,res));
	application.get('/cadastrar-equipamento', (req,res) => sistema.viewCadastrarEquipamento(application,req,res));
	application.get('/editar-excluir-equipamento', (req,res) => sistema.viewEditarExcluirEquipamento(application,req,res));
	application.get('/editar-equipamento', (req,res) => sistema.viewEditarEquipamento(application,req,res));
	application.get('/realizar-emprestimo', (req,res) => sistema.viewEmprestimo(application,req,res));
	application.get('/realizar-devolucao', (req,res) => sistema.viewDevolucao(application,req,res));
	application.get('/emprestimos-ativos/:nome', (req,res) => sistema.buscarUsuariosComEmprestimosAtivos(application,req,res));
	application.get('/visualizar-emprestimos-ativos', (req,res) => sistema.emprestimosAtivos(application,req,res));
	
	application.post('/realizar-emprestimo', (req,res) => sistema.realizarEmprestimo(application,req,res));
	application.post('/cadastrar-usuario', (req,res) => sistema.criarUsuario(application,req,res));
	application.post('/cadastrar-equipamento', (req,res) => sistema.cadastrarEquipamento(application,req,res));
	application.post('/editar-equipamento', (req,res) => sistema.editarEquipamento(application,req,res));
	
	application.delete('/apagar-equipamento/:id', (req,res) => sistema.apagarEquipamento(application,req,res));
};