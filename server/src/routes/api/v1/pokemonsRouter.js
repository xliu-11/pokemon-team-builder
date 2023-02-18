import express from "express";
import fetch from "node-fetch";
import { Pokemon } from "../../../models/index.js";

const pokemonsRouter = new express.Router();

pokemonsRouter.get("/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      const errorMessage = `${response.status} (${response.statusText})`;
      const error = new Error(errorMessage);
      throw error;
    }
    const body = await response.json();
    const pokemon = new Pokemon({
      name: body.name,
      image: body.sprites.front_default,
      type: body.types[0].type.name,
      secondaryType: body.types.length > 1 ? body.types[1].type.name : null,
      abilities: body.abilities
        .filter((ability) => !ability.is_hidden)
        .map((ability) => ability.ability.name),
      hiddenAbility: body.abilities.find((ability) => ability.is_hidden)?.ability.name || "",
      stats: body.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
    });
    await pokemon.save();
    res.status(201).json({ pokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default pokemonsRouter;
