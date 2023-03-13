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
  const [errorMessage, setErrorMessage] = useState("");

  const getPokemon = async () => {
    try {
      let response;
  
      if (featuredPokemonName) {
        response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${featuredPokemonName.toLowerCase()}`
        );
      } else {
        response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
        );
      }
  
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
      setErrorMessage("There was a problem fetching the Pokemon. Please try again later.");
    }
  };
  
  useEffect(() => {
    if (props.match.params.name) {
      setPokemonName(props.match.params.name);
      setFeaturedPokemonName(props.match.params.name);
    } else {
      getPokemon(); // if no search parameter, get the featured Pokemon
    }
  }, [props.match.params.name]);
  
  useEffect(() => {
    if (pokemonName) {
      getPokemon();
    }
  }, [pokemonName, featuredPokemonName]);  
  

  const addToTeam = async (pokemonName) => {
    try {
      const response = await fetch('/api/v1/teams', {
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
            <li className="stat-container" key={stat.name}>
              <strong>{stat.name === 'Special Attack' ? 'Sp. Atk' : stat.name === 'Special Defense' ? 'Sp. Def' : stat.name}: </strong>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-bar" style={{ width: `${stat.value/2.7}%` }} />
            </li>
          ))}
        </ul>
        {props.currentUser ? (
          <input className="add-to-team-button" type="submit" value="Add to Team!" onClick={handleAddToTeamClick}/>
        ) : (
          <p className="add-to-team-sign-in-message">Please sign in or sign up on the top right to add Pokémon to your team.</p>
        )}
      </div>
    </div>
  ); 
};

export default PokemonShow;