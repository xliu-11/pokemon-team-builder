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
      setTeam(body.team.slice(0, 6)); // only show the first 6 pokemon
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
            <p>Type: {pokemon.type}{pokemon.secondaryType && `, ${pokemon.secondaryType}`}</p>
          </div>
        ))}
      </div>
      <div className="lower-row">
        {team.slice(3, 6).map((pokemon) => (
          <div className="pokemon-info-col" key={pokemon.id}>
            <h4>{pokemon.name}</h4>
            <img src={pokemon.image} alt={pokemon.name} />
            <p>Type: {pokemon.type}{pokemon.secondaryType && `, ${pokemon.secondaryType}`}</p>
          </div>
        ))}
      </div>
      <Link to="/">Search for Another Pokémon to Add to Your Team!</Link>
    </div>
  );
};

export default PokemonTeam;
