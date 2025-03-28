var Aluno = require('../models/aluno');

module.exports.getAlunos = () => {
    return Aluno.find().sort({nome : 1}).exec();
}

module.exports.getAlunoByID = id => {
    return Aluno
        .findOne({_id: id})
        .exec();
}


module.exports.insertAluno = alunoData => {
    console.log("Dados recebidos para inserção:", alunoData);
  
    // Converter TPCs para booleanos
    for (let i = 1; i <= 8; i++) {
      const tpcKey = `tpc${i}`;
      if (alunoData[tpcKey]) {
        alunoData[tpcKey] = alunoData[tpcKey] === "1"; // Converte "1" para true
      }
    }
  
    // Criar um novo documento no MongoDB
    const novoAluno = new Aluno(alunoData);
    return novoAluno.save();
  };

module.exports.update = (alunoData, id) => {
    Object.keys(alunoData).forEach(key => {
      if (alunoData[key] === undefined || alunoData[key] === null) {
        delete alunoData[key];
      }
    });
  
    return Aluno
      .findByIdAndUpdate(id, alunoData, { new: true }) // Atualiza o aluno e retorna o documento atualizado
      .exec();
  };

module.exports.remove = id => {
    return Aluno
        .findByIdAndDelete(id)
        .exec();
}