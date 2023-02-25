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
  }, []);

  const topRow = team.slice(0, 3);
  const bottomRow = team.slice(3, 6);

  return (
    <div className="pokemon-team">
      <div className="pokemon-grid">
        {team.map((pokemon) => (
          <div className="pokemon-container" key={pokemon.id}>
            <h4>{pokemon.name}</h4>
            <img src={pokemon.image} alt={pokemon.name} />
            <p style={{marginBottom: '0px'}}>
              <strong>Type: </strong> {pokemon.type}
              {pokemon.secondaryType && `, ${pokemon.secondaryType}`}
            </p>
            <ul>
              <p>
                <strong>Ability:</strong> {pokemon.abilities.join(", ")}
                {pokemon.hiddenAbility && (
                  <>
                    <br />
                    <strong>Hidden Ability:</strong> {pokemon.hiddenAbility}
                  </>
                )}
              </p>
              {/* <p>
                <strong className="stats-text">Stats:</strong>
              </p> */}
              {pokemon.stats.map((stat) => (
                <div className="stat-container" key={stat.name}>
                  <h6 className="stat-label">
                    <strong>{stat.name === 'Special Attack' ? 'Sp. Atk' : stat.name === 'Special Defense' ? 'Sp. Def' : stat.name}:</strong> {stat.value}
                  </h6>
                  <div className="stat-bar" style={{ width: `${stat.value/1.5}%` }} />
                </div>
              ))}
            </ul>
            <button className="delete-button" onClick={() => deletePokemon(pokemon.id)}>Remove</button>
          </div>
        ))}
      </div>
      {/* <div className="text-center">
        <Link className="search-button-team-page" to="/">Search for a Pokémon!</Link>
      </div> */}
    </div>
  );

  
};

export default PokemonTeam;
