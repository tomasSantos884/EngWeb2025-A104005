const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    series: { type: String },
    author: { type: [String] }, // Array of strings for authors
    rating: { type: Number }, // Converted to a number
    description: { type: String },
    language: { type: String },
    isbn: { type: String },
    genres: { type: [String] }, // Array of strings for genres
    characters: { type: [String] }, // Array of strings for characters
    bookFormat: { type: String },
    edition: { type: String },
    pages: { type: Number }, // Converted to a number
    publisher: { type: String },
    publishDate: { type: String },
    firstPublishDate: { type: String },
    awards: { type: [String] }, // Array of strings for awards
    numRatings: { type: Number }, // Converted to a number
    ratingsByStars: { type: [Number] }, // Array of numbers
    likedPercent: { type: Number }, // Converted to a number
    setting: { type: [String] }, // Array of strings for settings
    coverImg: { type: String },
    bbeScore: { type: Number }, // Converted to a number
    bbeVotes: { type: Number }, // Converted to a number
    price: { type: Number } // Converted to a number
});

module.exports = mongoose.model('Livro', livroSchema);