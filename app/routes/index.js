const index = require('../controllers/index.js');
module.exports = (application) => {
	application.get('/',(req,res) => index.viewIndex(application,req,res));
	application.post('/login',(req,res) => index.login(application,req,res));
};