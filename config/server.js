/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

/* importar o módulo do express-validator */
const expressValidator = require('express-validator');

/* Importar o módulo do express-session. */
const expressSession = require('express-session');

/* iniciar o objeto do express */
const app = express();

const mongoose = require('mongoose');

const multiparty = require('connect-multiparty');
/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(multiparty());

/* configurar o middleware express-validator */
app.use(expressValidator());

/* Configurar o middleware express-session */
app.use(expressSession({
	secret: '80d499cac5e64c17620654587ec37dc5',
	resave: false,
	saveUninitialized: false
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/schemas')
	.then('app/models')
	.then('app/controllers')
	.then('app/routes')
	.into(app);

//Variaveis de ambiente
require('dotenv').config({ path: 'variables.env' });

// Conecta com o banco de dados e lida com problemas de conexão
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // → queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 → ${err.message}`);
});

/* exportar o objeto app */
module.exports = app;