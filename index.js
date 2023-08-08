const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000; 

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/pokedex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir un esquema para el modelo Pokémon
const PokemonSchema = new mongoose.Schema({
  nombre: String,
  tipo: String,
  descripcion: String,
  evolucion: Boolean,
  debilidades: String,
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});


  app.post('/registrar', async (req, res) => {
    const { nombre, tipo, descripcion, evolucion, debilidades } = req.body;
  
    try {
      // Crear un nuevo documento Pokémon en la base de datos
      await Pokemon.create({
        nombre,
        tipo,
        descripcion,
        evolucion: evolucion === 'on', // Convierte 'on' a true
        debilidades,
      });
  
      res.redirect('/pokemones');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al registrar el Pokémon');
    }
  });
  
  app.get('/pokemones', async (req, res) => {
    try {
      // Obtener todos los documentos Pokémon de la base de datos
      const pokemones = await Pokemon.find();
  
      res.render('pokemones', { pokemones }); // Puedes utilizar un motor de plantillas como EJS o Pug
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los Pokémon');
    }
  });
  
  //paso 3
  app.get('/pokemones', async (req, res) => {
    try {
      // Obtener todos los documentos Pokémon de la base de datos
      const pokemones = await Pokemon.find();
  
      // Renderizar la página HTML y enviar los datos de los pokémons al frontend
      res.render('pokemones', { pokemones }); // Puedes utilizar un motor de plantillas como EJS o Pug
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los Pokémon');
    }
  });

  
