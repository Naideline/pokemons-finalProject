const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  type: String,
  name: String,
  description: String,
  hasEvolution: Boolean,
  weaknesses: String,
  image: String, 
});

module.exports = mongoose.model('Pokemon', pokemonSchema);