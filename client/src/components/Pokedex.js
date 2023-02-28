import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchPokemonList = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  const handlePokemonClick = (name) => {
    history.push(`/pokemon-team-builder/details/${name}`);
  };
  
  return (
    <div className="pokedex-page">
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Pokédex...</p>
        </div>
      )}
      {!isLoading && (
        <div className="pokedex-container">
          {pokemonList.map((pokemon, index) => (
            <div
              key={index}
              className="pokemon-container"
              onClick={() => handlePokemonClick(pokemon.name)}
            >
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <p className="pokemon-name">{pokemon.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pokedex;
