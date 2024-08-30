document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    fetchPokemonList(); // 페이지 로드 시 포켓몬 리스트를 불러옵니다.

    // 검색 인풋 이벤트 리스너 추가
    document.getElementById('searchInput').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterPokemonList(query);
    });

    // 타입 드롭다운 이벤트 리스너 추가
    fetchAllTypes().then(types => {
        const primarySelect = document.getElementById('primaryTypeSelect');
        if (!primarySelect) {
            console.error('Primary type select element not found');
            return;
        }
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name;
            primarySelect.appendChild(option);
        });

        // 첫 번째 드롭다운에서 타입을 선택할 때 두 번째 드롭다운을 업데이트
        primarySelect.addEventListener('change', () => {
            const selectedType = primarySelect.value;
            updateSecondaryTypeSelect(selectedType);
            filterPokemonList(document.getElementById('searchInput').value.toLowerCase());
        });
    });

    // 세부 타입 드롭다운 이벤트 리스너 추가
    const secondarySelect = document.getElementById('secondaryTypeSelect');
    secondarySelect.addEventListener('change', () => {
        filterPokemonList(document.getElementById('searchInput').value.toLowerCase());
    });
});

let allPokemonData = []; // 전체 포켓몬 데이터 저장용
let activeTypeFilters = new Set(); // 활성화된 타입 필터 저장용

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
            const fetches = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));

            Promise.all(fetches).then(pokemonDataArray => {
                allPokemonData = pokemonDataArray;
                pokemonDataArray.sort((a, b) => a.id - b.id);
                renderPokemonList(pokemonDataArray);
            });
        })
        .catch(error => console.error('Error fetching the Pokemon list:', error));
}

function renderPokemonList(pokemonDataArray) {
    const pokemonList = document.getElementById('pokemonList');
    if (!pokemonList) {
        console.error('Pokemon list element not found');
        return;
    }
    pokemonList.innerHTML = '';

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
}

function fetchPokemonDetails(name) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${name}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const pokemonDetails = document.getElementById('pokemonDetails');
            if (!pokemonDetails) {
                console.error('Pokemon details element not found');
                return;
            }
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
                <p>Moves: ${data.moves.map(move => move.move.name).slice(0, 5).join(', ')}...</p>
                <p>Stats:</p>
                <ul>
                    ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                </ul>
            `;
        })
        .catch(error => console.error('Error fetching Pokemon details:', error));
}

function filterPokemonList(query) {
    const filteredData = allPokemonData.filter(pokemon =>
        pokemon.name.includes(query)
    );

    const selectedPrimaryType = document.getElementById('primaryTypeSelect').value;
    const selectedSecondaryType = document.getElementById('secondaryTypeSelect').value;

    const filteredByType = filteredData.filter(pokemon => {
        const types = pokemon.types.map(t => t.type.name);
        const primaryMatch = !selectedPrimaryType || types.includes(selectedPrimaryType);
        const secondaryMatch = !selectedSecondaryType || types.includes(selectedSecondaryType);
        return primaryMatch && secondaryMatch;
    });

    renderPokemonList(filteredByType);
}

function fetchAllTypes() {
    const apiUrl = 'https://pokeapi.co/api/v2/type';
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched types:', data.results); // 콘솔 로그 추가
            return data.results;
        })
        .catch(error => console.error('Error fetching Pokemon types:', error));
}

function updateSecondaryTypeSelect(primaryType) {
    const secondarySelect = document.getElementById('secondaryTypeSelect');
    if (!secondarySelect) {
        console.error('Secondary type select element not found');
        return;
    }
    secondarySelect.innerHTML = '<option value="">세부 타입 선택</option>'; // 초기화

    if (primaryType) {
        fetchAllTypes().then(types => {
            types.forEach(type => {
                if (type.name !== primaryType) {
                    const option = document.createElement('option');
                    option.value = type.name;
                    option.textContent = type.name;
                    secondarySelect.appendChild(option);
                }
            });
        });

        secondarySelect.disabled = false; // 활성화
    } else {
        secondarySelect.disabled = true; // 비활성화
    }
}
