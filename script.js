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
            const fetches = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));

            Promise.all(fetches).then(pokemonDataArray => {
                // ID 순으로 정렬
                pokemonDataArray.sort((a, b) => a.id - b.id);
                
                pokemonDataArray.forEach(pokemonData => {
                    const pokemonCard = document.createElement('div');
                    pokemonCard.className = 'pokemon-card';
                    pokemonCard.dataset.name = pokemonData.name;

                    pokemonCard.innerHTML = `
                        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" />
                        <p>${pokemonData.id}. ${pokemonData.name}</p>
                    `;

                    pokemonCard.addEventListener('click', () => {
                        fetchPokemonDetails(pokemonData.name);
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
                <h2>${data.id}. ${data.name}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}" />
                <p>Height: ${data.height}</p>
                <p>Weight: ${data.weight}</p>
                <p>Base Experience: ${data.base_experience}</p>
                <p>Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p>Types: ${data.types.map(type => type.type.name).join(', ')}</p>
                <p>Forms: ${data.forms.map(form => form.name).join(', ')}</p>
                <p>Game Indices: ${data.game_indices.map(index => index.version.name).join(', ')}</p>
                <p>Location Encounters: ${data.location_area_encounters}</p>
                <p>Moves: ${data.moves.map(move => move.move.name).slice(0, 5).join(', ')}...</p> <!-- 처음 5개의 기술만 표시 -->
                <p>Stats:</p>
                <ul>
                    ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                </ul>
            `;
        })
        .catch(error => console.error('Error fetching Pokemon details:', error));
}
