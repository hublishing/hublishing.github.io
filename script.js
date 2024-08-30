function fetchPokemonList() {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // 첫 번째 세대 포켓몬 151개를 가져옵니다.
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const pokemonList = document.getElementById('pokemonList');
            if (data.results) {
                data.results.forEach(pokemon => {
                    const pokemonCard = document.createElement('div');
                    pokemonCard.className = 'pokemon-card';
                    pokemonCard.dataset.name = pokemon.name;

                    pokemonCard.innerHTML = `
                        <p>${pokemon.name}</p>
                    `;

                    pokemonCard.addEventListener('click', () => {
                        fetchPokemonDetails(pokemon.name);
                    });

                    pokemonList.appendChild(pokemonCard);
                });
            } else {
                console.error('No results found');
            }
        })
        .catch(error => console.error('Error fetching the Pokemon list:', error));
}
