var Livro = require('../models/livros');

module.exports.getLivros = () => {
    return Livro.find().exec();
}

module.exports.getLivroBYID = (id) => {
    return Livro.findById(id).exec();
}

module.exports.getBooksByChar = async function(characterName) {
    try {
      // Find books where the character appears in the "characters" array
      const books = await Livro.find({ characters: characterName });
      return books;
    } catch (error) {
      throw error;
    }
}

module.exports.getBooksByGenre = async function(genre) {
    try {
      // Find books where the genre appears in the "genres" array
      const books = await Livro.find({ genres: genre });
      return books;
    } catch (error) {
      throw error;
    }
}

module.exports.getGenres = () => {

    return Livro.distinct("genres").exec();
}


module.exports.getCharacters = () => {
    return Livro.distinct("characters").exec();
}

module.exports.insertLivro = (livro) => {
    var novoLivro = new Livro(livro);
    return novoLivro.save();
}

module.exports.update = (livroData, id) => {
    Object.keys(livroData).forEach(key => {
      if (livroData[key] === undefined || livroData[key] === null) {
        delete livroData[key];
      }
    });
  
    return Livro
      .findByIdAndUpdate(id, livroData, { new: true }) // Atualiza o aluno e retorna o documento atualizado
      .exec();
  };

module.exports.remove = (id) => {
    return Livro.findByIdAndDelete(id).exec();
}

