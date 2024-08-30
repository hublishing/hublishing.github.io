document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    fetchPokemonList(); // 페이지 로드 시 포켓몬 리스트를 불러옵니다.
});

function fetchPokemonList() {
    console.log('Fetching Pokemon list...');
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
            data.results.forEach(pokemon => {
                const pokemonCard = document.createElement('div');
                pokemonCard.className = 'pokemon-card';
                pokemonCard.dataset.name = pokemon.name;

                // 이미지 URL을 얻기 위해 각 포켓몬의 세부 정보를 가져옴
                fetch(pokemon.url)
                    .then(res => res.json())
                    .then(pokemonData => {
                        pokemonCard.innerHTML = `
                            <img src="${pokemonData.sprites.front_default}" alt="${pokemon.name}" />
                            <p>${pokemon.name}</p>
                        `;

                        pokemonCard.addEventListener('click', () => {
                            fetchPokemonDetails(pokemon.name);
                        });

                        pokemonList.appendChild(pokemonCard);
                    });
            });
        })
        .catch(error => console.error('Error fetching the Pokemon list:', error));
}

function fetchPokemonDetails(name) {
    console.log(`Fetching details for ${name}...`);
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch details for ' + name);
            }
            return response.json();
        })
        .then(data => {
            console.log('Pokemon details:', data);
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
        .catch(error => console.error('Error fetching Pokemon details:', error));
}
