const pokemonContainer = document.getElementById("pokemon-container");

async function fetchAndDisplayPokemons() {
  try {
    const response = await fetch("/pokemons");
    const pokemons = await response.json();

    pokemonContainer.innerHTML = "";

    pokemons.forEach((pokemon) => {
      const pokemonDiv = document.createElement("div");
      pokemonDiv.classList.add("pokemon");

      const image = document.createElement("img");
      image.src = `/images/${pokemon.image}`;
      image.alt = pokemon.name;

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("info");
      infoDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${pokemon.name}</p>
        <p><strong>Tipo:</strong> ${pokemon.type}</p>
        <p><strong>Descripción:</strong> ${pokemon.description}</p>
        <p><strong>Tiene Evolución:</strong> ${
          pokemon.hasEvolution ? "Sí" : "No"
        }</p>
        <p><strong>Debilidades:</strong> ${pokemon.weaknesses}</p>
      `;

      pokemonDiv.appendChild(image);
      pokemonDiv.appendChild(infoDiv);
      pokemonContainer.appendChild(pokemonDiv);
    });
  } catch (error) {
    console.error("Error al obtener los Pokémones:", error);
  }
}

fetchAndDisplayPokemons();

const pokemonForm = document.getElementById("pokemon-form");

pokemonForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(pokemonForm);

  const newPokemon = {
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    hasEvolution: formData.get("evolution") === "on",
    weaknesses: formData.get("weaknesses"),
    image: formData.get("image"),
  };

  console.log("New Pokémon:", newPokemon);

  try {
    const response = await fetch("/pokemons", {
      method: "POST",
      body: formData,
    });

    if (response.status === 201) {
      alert("Pokémon registrado exitosamente.");
      fetchAndDisplayPokemons();
    } else {
      alert("Hubo un error al registrar el Pokémon.");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
});
