
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getSelectedPokemon = (pokemon) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => assembleSelectedPokemonInfo(jsonBody))
}

function assembleSelectedPokemonInfo(selectedPokemonDetail) {
    const selectedPokemon = new SelectedPokemon()
    selectedPokemon.name = selectedPokemonDetail.name
    const types = selectedPokemonDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    selectedPokemon.types = types
    selectedPokemon.type = type
    selectedPokemon.photo = selectedPokemonDetail.sprites.other.dream_world.front_default
    selectedPokemon.weight = selectedPokemonDetail.weight
    selectedPokemon.height = selectedPokemonDetail.height
    selectedPokemon.abilities = selectedPokemonDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)

    return pokeApi.convertPokemonDetailToHTML(selectedPokemon);
}

pokeApi.convertPokemonDetailToHTML = (selectedPokemon) => {
    return `
            <div class="top-section ${selectedPokemon.type}">
                <div class="top-section-text">
                    <span class="name">
                        ${selectedPokemon.name} 
                    </span>
                    <ul class="types">
                            ${selectedPokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ul>
                </div>
                <img class="card-img" src="${selectedPokemon.photo}" alt="${selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}">
            </div>
            <div class="main-section">
                <ul class="informationList" id="informationList">
                    <li> Height:        ${selectedPokemon.height} </li>
                    <li> Weight:        ${selectedPokemon.weight} </li>
                    <div class="abilities">
                        <li class="abilities"> 
                            Abilities: ${selectedPokemon.abilities.map((ability) => `<li>${ability}</li>`).join(',')}
                        </li>
                    </div>
                </ul>
            </div> 
        `
}