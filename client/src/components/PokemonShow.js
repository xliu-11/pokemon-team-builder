import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

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
  
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [pokemonName, setPokemonName] = useState("");
  const [featuredPokemonName, setFeaturedPokemonName] = useState("");

  const getPokemon = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
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

  useEffect(() => {
    if (props.location.state && props.location.state.pokemonName) {
      setPokemonName(props.location.state.pokemonName);
    }
  }, [props.location.state]);

  useEffect(() => {
    if (pokemonName) {
      getPokemon();
    }
  }, [pokemonName]);

  const addToTeam = async (pokemonName) => {
    try {
      const response = await fetch('/api/v1/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pokemonName })
      });
      const data = await response.json();
      setShouldRedirect(true);
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  const handleAddToTeamClick = () => {
    addToTeam(pokemonName);
  };

  if (shouldRedirect) {
    return <Redirect to={{ pathname: "/pokemon-team-builder/team" }} />;
  }

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
          <p key={stat.name}>
            {stat.name}: {stat.value}
          </p>
        ))}
      </ul>
        <input className="button" type="submit" value="Add to Team!" onClick={handleAddToTeamClick}/>
    </div>
  );
};

export default PokemonShow;