import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PokemonTeam = (props) => {
  const [team, setTeam] = useState([]);

  const fetchTeamData = async () => {
    try {
      const response = await fetch("/api/v1/teams");
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      setTeam(body.team.slice(0, 6));
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  return (
    <div className="text-center">
      <h2>My Pokémon Team</h2>
      <div className="pokemon-row">
        {team.slice(0, 3).map((pokemon) => (
          <div className="pokemon-info-col" key={pokemon.id}>
            <h4>{pokemon.name}</h4>
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
        <h6><strong>Stats:</strong></h6>
        <ul>
          {pokemon.stats.map((stat) => (
            <p key={stat.name}>
              <strong>{stat.name}:</strong> {stat.value}
            </p>
          ))}
        </ul>
          </div>
        ))}
      </div>
      <div className="lower-row">
        {team.slice(3, 6).map((pokemon) => (
          <div className="pokemon-info-col" key={pokemon.id}>
          <h4>{pokemon.name}</h4>
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
      <h6><strong>Stats:</strong></h6>
      <ul>
        {pokemon.stats.map((stat) => (
          <p key={stat.name}>
            <strong>{stat.name}:</strong> {stat.value}
          </p>
        ))}
      </ul>
        </div>
        ))}
      </div>
      <Link to="/">Search for Another Pokémon to Add to Your Team!</Link>
    </div>
  );
};

export default PokemonTeam;
