document.getElementById('searchButton').addEventListener('click', function() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    fetchPokemon(searchQuery);
});

function fetchPokemon(query) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pokemonList = document.getElementById('pokemonList');
            pokemonList.innerHTML = `
                <div class="pokemon-card" onclick="showDetails('${data.name}')">
                    <img src="${data.sprites.front_default}" alt="${data.name}" />
                    <p>${data.name}</p>
                </div>
            `;
        })
        .catch(error => console.error('Error:', error));
}

function showDetails(name) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pokemonDetails = document.getElementById('pokemonDetails');
            pokemonDetails.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}" />
                <p>Height: ${data.height}</p>
                <p>Weight: ${data.weight}</p>
                <p>Type: ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            `;
        })
        .catch(error => console.error('Error:', error));
}
