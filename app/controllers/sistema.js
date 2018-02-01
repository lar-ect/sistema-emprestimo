const mongoose = require('mongoose');
const Usuarios = mongoose.model('usuarios');
const Equipamentos = mongoose.model('equipamentos');
const crypto = require('crypto');
const autenticacao = require('../models/autenticacao.js');
const unique = require('array-unique');
const objectId = require('mongodb').ObjectID;

exports.viewSistema = (application,req,res) => {
	autenticacao.status(application,req,res);
	res.render('index');
}

exports.viewCriarUsuario = async (application,req,res) =>{
	autenticacao.status(application,req,res);
	res.render('novo-usuario');
}

exports.viewCadastrarEquipamento = async (application,req,res) => {
	autenticacao.status(application,req,res);
	const equipamentos = await Equipamentos.find({});
	let tamEquipamento = equipamentos.length;
	var arrayUniqueEquipamentos = [];
	for(let i =0; i<equipamentos.length;i++) arrayUniqueEquipamentos.push(equipamentos[i].tipoEquipamento);
	unique(arrayUniqueEquipamentos);
	res.render('cadastrar-equipamento',{equipamentos:arrayUniqueEquipamentos,tam:tamEquipamento});
}

exports.viewEditarExcluirEquipamento = async (application,req,res) => {
	const equipamentos = await Equipamentos.find({});
	res.render("editarExcluir-equipamento",{equipamentos:equipamentos});
}

exports.sair = (application,req,res) => {
	autenticacao.status(application,req,res);
	req.session.destroy((err) => res.redirect('/'));
}

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
}

exports.cadastrarEquipamento = async (application,req,res) => {
	console.log(req.body);
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
}

exports.apagarEquipamento = async (application,req,res) => {
	const removerEquipamento = await Equipamentos.remove({_id:objectId(req.params.id)});
	if(!removerEquipamento) res.status(203).json({status:false,msg:"Problema ao apagar arquivo."});
	res.status(200).json({status:true});
}