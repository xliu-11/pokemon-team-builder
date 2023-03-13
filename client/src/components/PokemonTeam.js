import React, { useState, useEffect, useCallback } from "react";

const PokemonTeam = (props) => {
  const [team, setTeam] = useState([]);

  const fetchTeamData = useCallback(async () => {
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
  }, []);

  const deletePokemon = async (id) => {
    try {
      setTeam(prevTeam => prevTeam.filter(pokemon => pokemon.id !== id));
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
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

return (
  <div className="pokemon-team">
    {team.length === 0 ? (
      <div className="no-pokemon-message">
        <h3>You currently have no Pokémon on your team. Add a Pokemon to your team by navigating to the "Pokédex" or the "Back to Search" tab on the top left!</h3>
      </div>
    ) : (
      <div className="pokemon-grid">
        {team.map((pokemon) => (
          <div className="pokemon-container-team-page" key={pokemon.id}>
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
              <ul>
                {pokemon.stats.map((stat) => (
                  <li className="stat-container" key={stat.name}>
                    <strong>{stat.name === 'Special Attack' ? 'Sp. Atk' : stat.name === 'Special Defense' ? 'Sp. Def' : stat.name}: </strong>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-bar" style={{ width: `${stat.value/3.2}%` }} />
                  </li>
                ))}
              </ul>
            </ul>
            <button className="delete-button" onClick={() => deletePokemon(pokemon.id)}>Remove</button>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default PokemonTeam;
