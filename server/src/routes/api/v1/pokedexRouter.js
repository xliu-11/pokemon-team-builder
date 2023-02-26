import express from "express";
import fetch from "node-fetch";

const pokedexRouter = new express.Router();

const getPokedex = async (req, res) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1008`);
    if (!response.ok) {
      const errorMessage = `${response.status} (${response.statusText})`;
      const error = new Error(errorMessage);
      throw error;
    }
    const body = await response.json();
    const pokemonList = body.results;
    const pokemonData = await Promise.all(
      pokemonList.map(async (pokemon) => {
        const data = await fetch(pokemon.url).then((response) => response.json());
        return { name: data.name, image: data.sprites.front_default };
      })
    );
    res.status(200).json(pokemonData);
  } catch (err) {
    console.error(`Error in fetch: ${err.message}`);
    res.status(500).send(`Error in fetch: ${err.message}`);
  }
};


pokedexRouter.get("/", getPokedex);

export default pokedexRouter;
