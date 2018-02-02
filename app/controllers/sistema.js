const mongoose = require('mongoose');
const Usuarios = mongoose.model('usuarios');
const Equipamentos = mongoose.model('equipamentos');
const Emprestimos = mongoose.model('emprestimos');
const crypto = require('crypto');
const autenticacao = require('../models/autenticacao.js');
const unique = require('array-unique');
const objectId = require('mongodb').ObjectID;
const matchSorter = require('match-sorter');

exports.viewSistema = async (application,req,res) => {
	autenticacao.status(application,req,res);
	const equipamentos = await Equipamentos.find({});
	const tamEquipamento = equipamentos.length;
	const emprestimos = await Emprestimos.find({status:true});
	const tamEmprestimos = emprestimos.length;
	res.render('index',{equipamentos:tamEquipamento,emprestimos:tamEmprestimos});
};

exports.viewCriarUsuario = (application,req,res) =>{
	autenticacao.status(application,req,res);
	res.render('novo-usuario');
};

exports.viewCadastrarEquipamento = async (application,req,res) => {
	autenticacao.status(application,req,res);
	var equipamentos = await Equipamentos.find({});
	let tamEquipamento = equipamentos.length;
	var arrayUniqueEquipamentos = [];
	for(let i =0; i<equipamentos.length;i++) arrayUniqueEquipamentos.push(equipamentos[i].tipoEquipamento);
	unique(arrayUniqueEquipamentos);
	res.render('cadastrar-equipamento',{equipamentos:arrayUniqueEquipamentos,tam:tamEquipamento});
};

exports.viewEditarExcluirEquipamento = async (application,req,res) => {
	const equipamentos = await Equipamentos.find({});
	res.render("editarExcluir-equipamento",{equipamentos:equipamentos});
};

exports.viewEditarEquipamento = async (application,req,res) => {
	autenticacao.status(application,req,res);
	var equipamentos = await Equipamentos.find({});
	let tamEquipamento = equipamentos.length;
	var arrayUniqueEquipamentos = [];
	for(let i =0; i<equipamentos.length;i++) arrayUniqueEquipamentos.push(equipamentos[i].tipoEquipamento);
	unique(arrayUniqueEquipamentos);
	equipamentos = await Equipamentos.find({_id:objectId(req.query.id)});
	res.render('editar-equipamento',{equipamentoSelecionado:equipamentos,
	equipamentos:arrayUniqueEquipamentos,tam:tamEquipamento});
};

exports.viewEmprestimo = (application,req,res) => {
	autenticacao.status(application,req,res);
	res.render('realizar-emprestimo');
};

exports.realizarEmprestimo = async (application,req,res) => {
	autenticacao.status(application,req,res);
	req.assert('nomePessoa', 'O nome da pessoa não pode ser vazio.').notEmpty();
	req.assert('cpf', 'O cpf não pode ser vazio.').notEmpty();
	req.assert('email', 'O email não pode ser vazio.').notEmpty();
	req.assert('telefone', 'O telefone não pode ser vazio.').notEmpty();
	req.assert('codigo', 'O código não pode ser vazio.').notEmpty();
	erros = await req.validationErrors();
	if(erros){
		res.status(203).json({status:false,erroForm:true,msg:erros});
        return;
	}
	const statusCodigo = await Equipamentos.findOne({codigo:req.body.codigo});
	if(!statusCodigo){
		var erroCodigo = [{msg:"O código informado não existe no sistema."}];
		res.status(203).json({status:false,erroForm:true,msg:erroCodigo});
	}
	req.body.responsavel = req.session.nome;
	req.body.status = true;
	req.body.codigoEquipamento = req.body.codigo;
	delete req.body.codigo;
	let newEmprestimo = new Emprestimos(req.body);
	await newEmprestimo.save();
	res.status(200).json({status:true,msg:"Emprestimo realizado com sucesso."});
};

exports.viewDevolucao = async (application,req,res) => {
	autenticacao.status(application,req,res);
	res.render('realizar-devolucao');
};

exports.devolver = async (application,req,res) => {
	const id = req.body.id;
	const realizarDevolucao = await Emprestimos.update({_id:objectId(id)},{$set:{status:false}});
	res.status(200).json({status:true});
	return
};

exports.buscarUsuariosComEmprestimosAtivos = async (application,req,res) =>{
	const emprestimosAtivos = await Emprestimos.find({status:true});
	var valoresNomes = matchSorter(emprestimosAtivos, req.params.nome, {keys: ['nomePessoa']})
	res.status(200).json({status:true,emprestimos:valoresNomes});
	return;
};

exports.emprestimosAtivos = async (aplication,req,res) => {
	const cpf = req.query.cpf;
	const emprestimos = await Emprestimos.find({cpf:cpf});
	res.render('visualizar-emprestimos',{emprestimos:emprestimos});
};

exports.editarEquipamento = async (application,req,res) => {
	autenticacao.status(application,req,res);
	const id = req.body.id;
	delete req.body.id;
	req.body._id = id;
	req.assert('nomeEquipamento', 'O nome não pode ser vazio').notEmpty();
	if(req.body.tipoEquipamento === "undefined" || req.body.emprestimo==="undefined"){
		erros = [{
			msg:"Selecione um tipo."
		},
		{
			msg:"Selecione uma opção para emprestimo."
		}];
		res.status(203).json({status:false,erroForm:true,msg:erros});
        return;
	}
	erros = await req.validationErrors();
	if(erros){
		res.status(203).json({status:false,erroForm:true,msg:erros});
        return;
	}
	const dadosEquimaentoNovo = req.body;
	const updateEquipamento = await Equipamentos.update({_id:objectId(id)},
		{$set:{
			_id:dadosEquimaentoNovo._id,
			nomeEquipamento:dadosEquimaentoNovo.nomeEquipamento,
		    tipoEquipamento:dadosEquimaentoNovo.tipoEquipamento,
		    codigo:dadosEquimaentoNovo.codigo,
		    emprestimo:dadosEquimaentoNovo.emprestimo	
		}});
	if(!updateEquipamento){
		res.status(203).json({status:false,erroForm:true,msg:[{msg:"Problema no acesso ao banco de dados."}]});
        return;
	}
	res.status(200).json({status:true,msg:"Equipamento editado com sucesso."});
	return;
};

exports.sair = (application,req,res) => {
	autenticacao.status(application,req,res);
	req.session.destroy((err) => res.redirect('/inventario'));
};

exports.criarUsuario = async (application,req,res) =>{
	req.assert('nome', 'O nome não pode ser vazio').notEmpty();
	req.assert('login', 'O email não pode ser vazio').notEmpty();
	req.assert('senha', 'A senha não pode ser vazia').notEmpty();
	req.assert('repetirSenha', 'Você não repetiu sua senha').notEmpty();
	req.assert('login', 'Digite um formato de email valido.').isEmail();
	req.assert('senha', 'As senhas não são iguais').equals(req.body.repetirSenha);
	const erros = req.validationErrors();
    if(erros){
		res.status(203).json({status:false,erroForm:true,msg:erros});
        return;
	}
	delete req.body.repetirSenha;
	req.body.senha = await crypto.createHash("md5").update(req.body.senha).digest("hex");
	let usuarios = await Usuarios.findOne({login:req.body.login});
	if(usuarios){
		res.status(203).json({status:false,erroLogin:true,msg:"Esse mail já foi utilizado para um cadastro."});
		return;
	}
	let novoUsuario = new Usuarios(req.body);
	let salvarUsuario = await novoUsuario.save();
	res.status(200).json({status:true,msg:"Usuário cadastrado com sucesso."});
};

exports.cadastrarEquipamento = async (application,req,res) => {
	var erros;
	req.assert('nomeEquipamento', 'O nome não pode ser vazio').notEmpty();
	if(req.body.tipoEquipamento === "undefined" || req.body.emprestimo==="undefined"){
		erros = [{
			msg:"Selecione um tipo."
		},
		{
			msg:"Selecione uma opção para emprestimo."
		}];
		res.status(203).json({status:false,erroForm:true,msg:erros});
        return;
	}
	erros = await req.validationErrors();
	if(erros){
		res.status(203).json({status:false,erroForm:true,msg:erros});
        return;
	}
	const equipamentos = await Equipamentos.find({});
	let tamEquipamento = equipamentos.length;
	req.body.codigo = "LAR"+tamEquipamento;
	let newEquipamento = new Equipamentos(req.body);
	let salvarEquipamento = await newEquipamento.save();
	res.status(200).json({status:true,msg:"Equipamento cadastrado com sucesso."});
};

exports.apagarEquipamento = async (application,req,res) => {
	const removerEquipamento = await Equipamentos.remove({_id:objectId(req.params.id)});
	if(!removerEquipamento) res.status(203).json({status:false,msg:"Problema ao apagar arquivo."});
	res.status(200).json({status:true});
};