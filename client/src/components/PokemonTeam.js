import React, { useState, useEffect } from "react";

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
    };
  }, [team]);

  // useEffect(() => {
  //   fetchTeamData();
  // }, [team]);

  return (
    <div className="pokemon-team">
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
    </div>
  );
};

export default PokemonTeam;
