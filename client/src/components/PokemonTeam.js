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

  const deletePokemon = async (id) => {
    try {
      const response = await fetch(`/api/v1/teams/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      setTeam(prevTeam => prevTeam.filter(pokemon => pokemon.id !== id));
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };  

  useEffect(() => {
    let isMounted = true;
    fetchTeamData().then(() => {
      if (isMounted) {
        // Only update state if component is still mounted
        setTeam(prevTeam => prevTeam.slice(0, 6));
      }
    });
    return () => {
      isMounted = false;
    }
  }, [team]);

  const topRow = team.slice(0, 3);
  const bottomRow = team.slice(3, 6);

  return (
    <div className="text-center">
      <h2>My Pokémon Team</h2>
      <div className="pokemon-row">
        {topRow.map((pokemon) => (
          <div className="pokemon-container" key={pokemon.id}>
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
            <h6>
              <strong>Stats:</strong>
            </h6>
            <ul>
              {pokemon.stats.map((stat) => (
                <p key={stat.name}>
                  <strong>{stat.name}:</strong> {stat.value}
                </p>
              ))}
            </ul>
            <button onClick={() => deletePokemon(pokemon.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="pokemon-row">
        {bottomRow.map((pokemon) => (
          <div className="pokemon-container" key={pokemon.id}>
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
            <h6>
              <strong>Stats:</strong>
            </h6>
            <ul>
              {pokemon.stats.map((stat) => (
                <p key={stat.name}>
                  <strong>{stat.name}:</strong> {stat.value}
                </p>
              ))}
            </ul>
            <button onClick={() => deletePokemon(pokemon.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
};

export default PokemonTeam;
