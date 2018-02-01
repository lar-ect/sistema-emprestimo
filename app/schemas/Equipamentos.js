const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const equipamentosSchema = new mongoose.Schema({
    nomeEquipamento:String,
    tipoEquipamento:String,
    codigo:String,
    emprestimo:Boolean
});
module.export = mongoose.model('equipamentos', equipamentosSchema);