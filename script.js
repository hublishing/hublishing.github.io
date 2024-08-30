document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    fetchPokemonList(); // 페이지 로드 시 포켓몬 리스트를 불러옵니다.
});

function fetchPokemonList() {
    console.log('Fetching Pokemon list...');
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // 첫 번째 세대 포켓몬 151개를 가져옵니다.
    fetch(apiUrl)
        .then(response => {
            console.log('Response Status:', response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data); // 데이터가 제대로 받아졌는지 로그 출력
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

function fetchPokemonDetails(name) {
    console.log(`Fetching details for ${name}...`);
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    fetch(apiUrl)
        .then(response => response.json())
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
