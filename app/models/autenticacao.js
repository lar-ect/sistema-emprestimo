exports.status = (application,req,res) => {
	if(!req.session.status){
		res.redirect('/');
		return;
	}
};