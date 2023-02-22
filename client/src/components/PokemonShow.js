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
      const name = body.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
      const image = body.sprites.front_default;
      const type = body.types[0].type.name.charAt(0).toUpperCase() + body.types[0].type.name.slice(1);
      const secondaryType =
        body.types.length > 1 ? body.types[1].type.name.charAt(0).toUpperCase() + body.types[1].type.name.slice(1) : null;
      const abilities = body.abilities
        .filter((ability) => !ability.is_hidden)
        .map((ability) => ability.ability.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
      const hiddenAbility = body.abilities.find(
        (ability) => ability.is_hidden
      );
      const hiddenAbilityName = hiddenAbility ? hiddenAbility.ability.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
      const stats = body.stats.map((stat) => {
        return {
          name: stat.stat.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
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
    <div className="text-center pokemon-show">
      <div className="pokemon-box">
        <h1>{pokemon.name}</h1>
        <img src={pokemon.image} alt={pokemon.name} />
        <p>
          <strong>Type: </strong> {pokemon.type}
          {pokemon.secondaryType && `, ${pokemon.secondaryType}`}
        </p>
        <p>
          <strong>Abilities:</strong> {pokemon.abilities.join(", ")}
          {pokemon.hiddenAbility && (
            <>
              <br />
                <strong>Hidden Ability:</strong> {pokemon.hiddenAbility}
            </>
          )}
        </p>
        <h5><strong>Stats:</strong></h5>
        <ul>
          {pokemon.stats.map((stat) => (
            <p key={stat.name}>
              <strong>{stat.name}:</strong> {stat.value}
            </p>
          ))}
        </ul>
        <input className="button" type="submit" value="Add to Team!" onClick={handleAddToTeamClick}/>
      </div>
    </div>
  );  
};

export default PokemonShow;