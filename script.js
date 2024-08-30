document.addEventListener('DOMContentLoaded', function() {
    fetchPokemonList(); // 페이지 로드 시 포켓몬 리스트를 불러옵니다.
});

document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        const name = card.dataset.name;
        if (name.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

function fetchPokemonList() {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // 첫 번째 세대 포켓몬 151개를 가져옵니다.
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pokemonList = document.getElementById('pokemonList');
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
        })
        .catch(error => console.error('Error:', error));
}

function fetchPokemonDetails(name) {
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
                <p>Base Experience: ${data.base_experience}</p>
                <p>Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p>Types: ${data.types.map(type => type.type.name).join(', ')}</p>
                <p>Stats:</p>
                <ul>
                    ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                </ul>
            `;
        })
        .catch(error => console.error('Error:', error));
}
