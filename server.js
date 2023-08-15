const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const Pokemon = require("./models/pokemon.js");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/pokemongo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al obtener los Pokémones." });
  }
});

app.post("/pokemons", upload.single("image"), async (req, res) => {
  const newPokemon = req.body;

  if (req.file) {
    newPokemon.image = req.file.filename;
  }

  try {
    const createdPokemon = await Pokemon.create(newPokemon);
    res.status(201).json({ message: "Pokémon registrado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Hubo un error al registrar el Pokémon." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
