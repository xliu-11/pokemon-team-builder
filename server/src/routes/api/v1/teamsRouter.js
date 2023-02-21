import express from "express";
import { Pokemon, UserPokemon } from "../../../models";

const teamsRouter = new express.Router();

teamsRouter.post("/team", async (req, res) => {
  const pokemonName = req.body.pokemonName;
  try {
    const newPokemon = new Pokemon({ name: pokemonName });
    await newPokemon.$query().insert();
    
    // Check if authenticated user exists in the database
    const userId = req.user.id;
    const user = await User.query().findById(userId);

    if (user) {
      // Link the authenticated user and the new Pokemon
      const userPokemon = new UserPokemon({
        userId: userId,
        pokemonId: newPokemon.id
      });
      await userPokemon.$query().insert();
    }

    res.status(201).json({ message: "Pokemon added to team!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default teamsRouter;

