const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
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