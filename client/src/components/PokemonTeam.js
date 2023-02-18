import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PokemonTeam = (props) => {
  const [team, setTeam] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [newPokemonName, setNewPokemonName] = useState("");
  const [newPokemonImage, setNewPokemonImage] = useState("");
  const [newPokemonType, setNewPokemonType] = useState("");
  const [newPokemonSecondaryType, setNewPokemonSecondaryType] = useState("");

  const handleAddTeam = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/v1/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teamName,
        }),
      });

      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }

      const body = await response.json();
      setTeam(body.team);
      setTeamName("");
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      const response = await fetch(`/api/v1/teams/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }

      const updatedTeamList = team.filter((t) => t._id !== id);
      setTeam(updatedTeamList);
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleAddPokemonToTeam = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/v1/pokemons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPokemonName,
          image: newPokemonImage,
          type: newPokemonType,
          secondaryType: newPokemonSecondaryType,
        }),
      });

      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }

      const body = await response.json();
      const newPokemon = body.pokemon;

      const response2 = await fetch(`/api/v1/teams/${team[0]._id}/pokemons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pokemonId: newPokemon._id,
        }),
      });

      if (!response2.ok) {
        const errorMessage = `${response2.status} (${response2.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }

      const body2 = await response2.json();
      setTeam(body2.team);
      setNewPokemonName("");
      setNewPokemonImage("");
      setNewPokemonType("");
      setNewPokemonSecondaryType("");
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`);
    }
  };

  const handleRemovePokemonFromTeam = async (pokemonId) => {
    try {
      const response = await fetch(`/api/v1/teams/${team[0]._id}/pokemons/${pokemonId}`, {
        method: "DELETE",
      });
  
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

  return (
    <div>
      <h2>My Pokemon Team</h2>
      <form onSubmit={handleAddTeam}>
        <label>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
          />
        </label>
        <button type="submit">Add Team</button>
      </form>
      <ul>
        {team.map((t) => (
          <li key={t._id}>
            <Link to={`/teams/${t._id}`}>{t.name}</Link>
            <button onClick={() => handleDeleteTeam(t._id)}>Delete Team</button>
            <ul>
              {t.pokemons.map((p) => (
                <li key={p._id}>
                  {p.name} - {p.type}
                  <button onClick={() => handleRemovePokemonFromTeam(p._id)}>
                    Remove Pokemon
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddPokemonToTeam}>
        <label>
          Pokemon Name:
          <input
            type="text"
            value={newPokemonName}
            onChange={(event) => setNewPokemonName(event.target.value)}
          />
        </label>
        <label>
          Pokemon Image:
          <input
            type="text"
            value={newPokemonImage}
            onChange={(event) => setNewPokemonImage(event.target.value)}
          />
        </label>
        <label>
          Pokemon Type:
          <input
            type="text"
            value={newPokemonType}
            onChange={(event) => setNewPokemonType(event.target.value)}
          />
        </label>
        <label>
          Pokemon Secondary Type:
          <input
            type="text"
            value={newPokemonSecondaryType}
            onChange={(event) => setNewPokemonSecondaryType(event.target.value)}
          />
        </label>
        <button type="submit">Add Pokemon</button>
      </form>
    </div>
  );
 }  

 export default PokemonTeam;
  
