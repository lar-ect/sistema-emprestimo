const mongoose = require('mongoose');
const Usuario = mongoose.model('usuarios');
const crypto = require('crypto');
const autenticacao = require('../models/autenticacao.js');

exports.viewSistema = (application,req,res) => {
	autenticacao.status(application,req,res);
	res.render('index');
}
exports.sair = (application,req,res) => {
	autenticacao.status(application,req,res);
	req.session.destroy((err) => res.redirect('/'));
}
exports.viewCriarUsuario = async (application,req,res) =>{
	autenticacao.status(application,req,res);
	res.render('novo-usuario');
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
	let usuarios = await Usuario.findOne({login:req.body.login});
	if(usuarios){
		res.status(203).json({status:false,erroLogin:true,msg:"Esse mail já foi utilizado para um cadastro."});
		return;
	}
	let novoUsuario = new Usuario(req.body);
	let salvarUsuario = await novoUsuario.save();
	res.status(200).json({status:true,msg:"Usuário cadastrado com sucesso."});
}