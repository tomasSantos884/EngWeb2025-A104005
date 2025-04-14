var contrato = require('../models/contrato');


module.exports.getContratos = () => {
    return contrato.find().exec();
}

module.exports.getContratoById = id => {
    return contrato
        .findById(id)
        .exec();
}

module.exports.getContratosByEntidade = entidade => {
    return contrato
        .find({"entidade_comunicante": entidade })
        .exec();
}

module.exports.getContratosByTipo = tipo => {
    return contrato
        .find({"tipoprocedimento": tipo })
        .exec();
}

module.exports.getEntidades = () => {
    return contrato
        .distinct("entidade_comunicante")
        .exec();
}

module.exports.getTipos = () => {
    return contrato
        .distinct("tipoprocedimento")
        .sort({tipoprocedimento : 1})
        .exec();
}




module.exports.update = (updatedContrato, id) => {
    return contrato
        .findByIdAndUpdate(id, updatedContrato, {new : true})
        .exec()
}

module.exports.delete = (id) => {
    return contrato
    .findByIdAndDelete(id)
    .exec()
}
