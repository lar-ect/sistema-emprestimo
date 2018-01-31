'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const usuarioSchema = new mongoose.Schema({
    nome:String,
    login:String,
    senha:String
});
module.export = mongoose.model('Usuario', usuarioSchema);