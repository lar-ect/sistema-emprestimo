const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const crypto = require('crypto');
const sistema = require('../controllers/sistema.js');
exports.viewIndex = (application,req,res) => {
	if(req.session.status){
		sistema.viewSistema(application,req,res);
		return;
	}
	res.render('login');
};
exports.login = async (application,req,res) => {
	const senhaCriptogafada = await crypto.createHash("md5").update(req.body.senha).digest("hex");
	const findUser = await Usuario.findOne({login:req.body.email,senha:senhaCriptogafada});
	if(findUser!==null){
		req.session.status = true;
		res.status(200).json({status:true,msg:"Usuário autorizado."});
		return;
	}else{
		req.session.status = false;
		res.status(203).json({status:false,msg:"Usuário não autorizado."});
		return;
	}
};