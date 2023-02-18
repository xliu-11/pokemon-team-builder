import React, { useState, useEffect } from "react";

const PokemonShow = (props) => {
  const [pokemon, setPokemon] = useState({
    name: "",
    image: "",
    type: "",
    secondaryType: null,
    abilities: [],
    hiddenAbility: "",
    stats: [],
  });

  
  useEffect(() => {
    const getPokemon = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${props.location.state.pokemonName}`
          );
          if (!response.ok) {
            const errorMessage = `${response.status} (${response.statusText})`;
            const error = new Error(errorMessage);
            throw error;
          }
          const body = await response.json();
          const name = body.name;
          const image = body.sprites.front_default;
          const type = body.types[0].type.name;
          const secondaryType =
          body.types.length > 1 ? body.types[1].type.name : null;
          const abilities = body.abilities
          .filter((ability) => !ability.is_hidden)
          .map((ability) => ability.ability.name);
          const hiddenAbility = body.abilities.find(
            (ability) => ability.is_hidden
            );
            const hiddenAbilityName = hiddenAbility ? hiddenAbility.ability.name : "";
            const stats = body.stats.map((stat) => {
              return {
                name: stat.stat.name,
                value: stat.base_stat,
              };
            });
            
            setPokemon({
              name: name,
              image: image,
              type: type,
              secondaryType: secondaryType,
              abilities: abilities,
              hiddenAbility: hiddenAbilityName,
              stats: stats,
            });
          } catch (err) {
            console.error(`Error in fetch: ${err.message}`);
          }
        };
        
        getPokemon();
      }, [props.location.state.pokemonName]);

      
     const handleAddToTeamClick = async () => {
        const pokemonData = {
          name: pokemon.name,
          image: pokemon.image,
          type: pokemon.type,
          secondaryType: pokemon.secondaryType,
          abilities: pokemon.abilities,
          hiddenAbility: pokemon.hiddenAbility,
          stats: pokemon.stats,
        };
      
        try {
          const response = await fetch('/api/v1/pokemons', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify(pokemonData),
          });
      
          if (!response.ok) {
            const errorMessage = `${response.status} (${response.statusText})`;
            const error = new Error(errorMessage);
            throw error;
          }
      
          const body = await response.json();
      
          // Get the teams from the response
          const teams = body.teams;
      
          // Find the first team that is not full
          const team = teams.find((team) => team.pokemons.length < 6);
      
          if (team) {
            // If there is a team that is not full, add the pokemon to that team
            const addResponse = await fetch(`/api/v1/teams/${team._id}/pokemons/${body.pokemon._id}`, {
              method: 'PUT',
              headers: new Headers({
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify({}),
            });
      
            if (!addResponse.ok) {
              const errorMessage = `${addResponse.status} (${addResponse.statusText})`;
              const error = new Error(errorMessage);
              throw error;
            }
      
            // Redirect to the team page
            props.history.push({
              pathname: `/teams/${team._id}`,
              state: { team: team },
            });
          } else {
            // If there are no teams that are not full, show an error message
            alert('All teams are full. Please create a new team.');
          }
        } catch (err) {
          console.error(`Error in fetch: ${err.message}`);
        }
      };
      

return (
    <div className="text-center">
      <h1>{pokemon.name}</h1>
      <img src={pokemon.image} alt={pokemon.name} />
      <p>
        Type: {pokemon.type}
        {pokemon.secondaryType && `, ${pokemon.secondaryType}`}
      </p>
      <p>
        Abilities: {pokemon.abilities.join(", ")}
        {pokemon.hiddenAbility && (
          <>
            <br />
            Hidden Ability: {pokemon.hiddenAbility}
          </>
        )}
      </p>
      <h4>Stats:</h4>
      <ul>
        {pokemon.stats.map((stat) => (
          <li key={stat.name}>
            {stat.name}: {stat.value}
          </li>
        ))}
      </ul>
      <input
        className="button"
        type="submit"
        value="Add to Team!"
        onClick={handleAddToTeamClick}
      />
    </div>
  );
};

export default PokemonShow;
