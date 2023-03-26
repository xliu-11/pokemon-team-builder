import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [featuredPokemonImage, setFeaturedPokemonImage] = useState("");
  const [featuredPokemonName, setFeaturedPokemonName] = useState("");
  const [featuredPokemonType, setFeaturedPokemonType] = useState("");
  const [featuredPokemonSecondaryType, setFeaturedPokemonSecondaryType] = useState("");
  const [featuredPokemonAbility, setFeaturedPokemonAbility] = useState([]);
  const [featuredPokemonStats, setFeaturedPokemonStats] = useState([]);
  
  const history = useHistory();
  
  const handleInputChange = (event) => {
    setPokemonName(event.target.value);
  };

  const searchPokemon = async (event) => {
    event.preventDefault();
    try {
      if (!pokemonName) {
        setErrorMessage("Please enter a Pokémon name.");
        return;
      }
      setErrorMessage("");
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("Could not find a Pokémon with that name.");
          return;
        }
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      history.push({
        pathname: `/pokemon-team-builder/details/${pokemonName.toLowerCase()}`,
        state: {
          pokemonName: pokemonName,
        },
      });
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  const handleClick = async () => {
    try {
      const formattedName = featuredPokemonName.toLowerCase().replace(/ /g, '-');
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${formattedName}`);
      const data = await res.json();
      history.push({
        pathname: `/pokemon-team-builder/details/${formattedName}`,
        state: {
          pokemonName: featuredPokemonName,
        },
      });
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };  

  useEffect(() => {
    const fetchFeaturedPokemon = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=1000`
        );
        if (!response.ok) {
          const errorMessage = `${response.status} (${response.statusText})`;
          const error = new Error(errorMessage);
          throw error;
        }
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomPokemonUrl = data.results[randomIndex].url;
        const randomPokemonResponse = await fetch(randomPokemonUrl);
        const randomPokemonData = await randomPokemonResponse.json();
        setFeaturedPokemonImage(randomPokemonData.sprites.front_default);
        setFeaturedPokemonName(randomPokemonData.name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()));
        setFeaturedPokemonType(randomPokemonData.types[0].type.name.replace(/\b\w/g, (char) => char.toUpperCase()));
        if (randomPokemonData.types.length > 1) {
          setFeaturedPokemonSecondaryType(randomPokemonData.types[1].type.name.replace(/\b\w/g, (char) => char.toUpperCase()));
        } else {
          setFeaturedPokemonSecondaryType(null);
        }
        setFeaturedPokemonAbility(randomPokemonData.abilities.map((ability) => ability.ability.name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())));
        setFeaturedPokemonStats(randomPokemonData.stats.map((stat) => {
          return {
            name: stat.stat.name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
            value: stat.base_stat,
          };
        }));
        
      } catch (err) {
        console.error(`Error in fetch: ${err.message}`);
      }
    };
  
    fetchFeaturedPokemon();
  }, []);
  

  return (
    <div className="homepage-container">
      <div className="search-container">
        <h1 className="homepage-headers">Pokémon Team Builder</h1>
        <h4 className="homepage-headers">Search a Pokémon By Name:</h4>
        <form onSubmit={searchPokemon}>
          <input
            type="text"
            style={{
              width: "20%",
              margin: "20px auto",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
            onChange={handleInputChange}
            value={pokemonName}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#1E90FF",
              color: "#fff",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              marginBottom: "20px"
            }}
          >
            Search Pokémon!
          </button>
        </form>
        {errorMessage && (
          <div className="search-error-message">{errorMessage}</div>
        )}
      </div>
  
      <div className="featured-pokemon-container">
        <h3>Pokémon Spotlight:</h3>
        <h4>{featuredPokemonName}</h4>
        {featuredPokemonImage && (
          <button onClick={handleClick} className="featured-pokemon-image-button">
            <img src={featuredPokemonImage} alt="Featured Pokemon" />
          </button>
        )}
        <h6>Type: {featuredPokemonType}</h6>
        {featuredPokemonSecondaryType && (
          <h6>Secondary Type: {featuredPokemonSecondaryType}</h6>
        )}
        <h6>Ability: {featuredPokemonAbility.join(", ")}</h6>
        <h6>|| 
          {featuredPokemonStats.map((stat) => (
            <span key={stat.name}>{`  ${stat.name}: ${stat.value}  ||  `}</span>
          ))}
        </h6>
      </div>
    </div>
  );  
}

 export default Homepage

