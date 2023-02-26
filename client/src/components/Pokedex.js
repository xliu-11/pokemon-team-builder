import React, { useState, useEffect } from "react";

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch("/api/v1/pokedex");
        if (!response.ok) {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
        const body = await response.json();
        setPokemonList(body);
      } catch (error) {
        console.error(`Error in fetch: ${error.message}`);
      }
    };
    fetchPokemonList();
  }, []);

  return (
    <div className="pokedex-container">
      {pokemonList.map((pokemon, index) => (
        <div key={index} className="pokemon-container">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-image"
          />
          <p className="pokemon-name">{pokemon.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Pokedex;
