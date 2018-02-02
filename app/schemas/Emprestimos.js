const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const emprestimosSchema = new mongoose.Schema({
    nomePessoa:String,
    cpf:String,
    email:String,
    telefone:String,
    codigoEquipamento:String,
    responsavel:String,
    status:Boolean
});
module.export = mongoose.model('emprestimos', emprestimosSchema);