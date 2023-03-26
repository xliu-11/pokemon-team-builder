import express from "express";
import fetch from "node-fetch";

const homepageRouter = new express.Router();

homepageRouter.get("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        res.status(404).send("Could not find a Pokémon with that name.");
        return;
      }
      const errorMessage = `${response.status} (${response.statusText})`;
      const error = new Error(errorMessage);
      throw error;
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`Error in fetch: ${err.message}`);
    res.status(500).send("Internal Server Error");
  }
});

homepageRouter.get("/", async (req, res) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1008`);
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
    const featuredPokemon = {
      image: randomPokemonData.sprites.front_default,
      name: randomPokemonData.name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      type: randomPokemonData.types[0].type.name.replace(/\b\w/g, (char) => char.toUpperCase()),
      secondaryType: randomPokemonData.types.length > 1 ? randomPokemonData.types[1].type.name.replace(/\b\w/g, (char) => char.toUpperCase()) : null,
      ability: randomPokemonData.abilities.map((ability) => ability.ability.name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())),
      stats: randomPokemonData.stats.map((stat) => ({
        name: stat.stat.name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        value: stat.base_stat,
      })),
    };
    res.json(featuredPokemon);
  } catch (err) {
    console.error(`Error in fetch: ${err.message}`);
    res.status(500).send("Internal Server Error");
  }
});


export default homepageRouter;
