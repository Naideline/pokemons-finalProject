const pokemonContainer = document.getElementById("pokemon-container");

async function fetchAndDisplayPokemons(searchTerm = "", typeFilter = "") {
  try {
    const response = await fetch("/pokemons");
    const pokemons = await response.json();

    const filteredPokemons = pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (typeFilter === "" ||
          pokemon.type.toLowerCase().includes(typeFilter.toLowerCase()))
    );

    pokemonContainer.innerHTML = "";

    filteredPokemons.forEach((pokemon) => {
      const pokemonDiv = createPokemonDiv(pokemon);
      pokemonContainer.appendChild(pokemonDiv);
    });
  } catch (error) {
    console.error("Error al obtener los Pokémones:", error);
  }
}

function createPokemonDiv(pokemon) {
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
    <button class="delete-button" data-id="${pokemon._id}">Eliminar</button>
  `;
  if (pokemon.hasEvolution) {
    infoDiv.classList.add("has-evolution");
  }
  pokemonDiv.appendChild(image);
  pokemonDiv.appendChild(infoDiv);

  return pokemonDiv;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayPokemons();

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const typeInput = document.getElementById("type-filter");
  const filterButton = document.getElementById("filter-button");
  const pokemonForm = document.getElementById("pokemon-form");

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    const typeFilter = typeInput.value;
    fetchAndDisplayPokemons(searchTerm, typeFilter);
  });

  filterButton.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    const typeFilter = typeInput.value;
    fetchAndDisplayPokemons(searchTerm, typeFilter);
  });

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
});

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayPokemons();

  pokemonContainer.addEventListener("click", async (event) => {
    const target = event.target;
    if (target.classList.contains("delete-button")) {
      const pokemonDiv = target.closest(".pokemon");
      const confirmDelete = confirm(
        "¿Estás seguro de que deseas eliminar este Pokémon?"
      );
      if (confirmDelete) {
        pokemonDiv.remove();
      }
    }
  });
});
