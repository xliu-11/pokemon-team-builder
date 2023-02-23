import express from "express";
import { Pokemon, UserPokemon, User } from "../../../models/index.js";

const teamsRouter = new express.Router();

teamsRouter.post("/", async (req, res) => {
  const pokemonName = req.body.pokemonName;
  console.log(req.body.pokemonName)

  try {
    let pokemon = await Pokemon.query().findOne({ name: pokemonName });

    if (!pokemon) {
      // Pokemon doesn't exist yet, so add it to the database
      pokemon = await Pokemon.query().insert({ name: pokemonName });
    }

    // Check if authenticated user exists in the database
    const userId = req.user.id;
    const user = await User.query().findById(userId);

    if (user) {
      // Link the authenticated user and the new Pokemon
      await UserPokemon.query().insert({
        userId: userId,
        pokemonId: pokemon.id,
      });
    }

    res.status(201).json({ message: "Pokemon added to team!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

teamsRouter.get("/", async (req, res) => {
  try {
    // Get the authenticated user's team
    const userId = req.user.id;
    const user = await User.query().findById(userId);

    if (user) {
      const userPokemons = await user.$relatedQuery("pokemons")

      // here, feed all the pkemon to the third party API, then send back the actual real pokemon data

      res.json({ team: userPokemons });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default teamsRouter;
