import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PokemonTeam = (props) => {
  const [team, setTeam] = useState([]);
// debugger
  const fetchTeamData = async () => {
    try {
      const response = await fetch("/api/v1/teams");
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();
      setTeam(body.team);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const updateTeamData = async () => {
    const updatedTeam = await Promise.all(
      team.map(async (pokemon) => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
          );
          if (!response.ok) {
            const errorMessage = `${response.status} (${response.statusText})`;
            const error = new Error(errorMessage);
            throw error;
          }
          const body = await response.json();
          const image = body.sprites.front_default;
          const type = body.types[0].type.name;
          const secondaryType =
            body.types.length > 1 ? body.types[1].type.name : null;

          return {
            ...pokemon,
            image: image,
            type: type,
            secondaryType: secondaryType,
          };
        } catch (error) {
          console.error(`Error in fetch: ${error.message}`);
        }
      })
    );
    setTeam(updatedTeam);
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  // useEffect(() => {
  //   updateTeamData();
  // }, [team]);

  console.log(team)

  return (
    <div className="text-center">
      <h1>My Pokemon Team</h1>
      <ul>
        {team.slice(0, 6).map((pokemon) => (
          <li key={pokemon.id}>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} />
            <p>Type: {pokemon.type}</p>
            {pokemon.secondaryType && (
              <p>Secondary Type: {pokemon.secondaryType}</p>
            )}
          </li>
        ))}
      </ul>
      <Link to="/">Search for Another Pokémon to Add to Your Team!</Link>
    </div>
  );
};

export default PokemonTeam;
