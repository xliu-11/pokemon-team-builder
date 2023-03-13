import express from "express";
import { Pokemon, UserPokemon, User } from "../../../models/index.js";
import fetch from "node-fetch";

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

      // Construct an array of promises to fetch Pokemon data from PokeAPI
      const pokemonDataPromises = userPokemons.map((pokemon) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`)
          .then((response) => response.json())
      );

      // Wait for all the promises to resolve
      const pokemonDataResponses = await Promise.all(pokemonDataPromises);

      // Map the Pokemon data to the format expected by the frontend
      const updatedTeam = userPokemons.map((pokemon, index) => {
        const data = pokemonDataResponses[index];
        const name = data.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const image = data.sprites.front_default;
        const type = data.types[0].type.name.charAt(0).toUpperCase() + data.types[0].type.name.slice(1);
        const secondaryType =
          data.types.length > 1 ? data.types[1].type.name.charAt(0).toUpperCase() + data.types[1].type.name.slice(1) : null;
        const abilities = data.abilities
          .filter((ability) => !ability.is_hidden)
          .map((ability) => ability.ability.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
        const hiddenAbility = data.abilities.find(
                (ability) => ability.is_hidden
              );
        const hiddenAbilityName = hiddenAbility ? hiddenAbility.ability.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
        const stats = data.stats.map((stat) => {
        return {
          name: stat.stat.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          value: stat.base_stat,
        };
      });

        return {
          ...pokemon,
          name,
          image,
          type,
          secondaryType,
          abilities,
          hiddenAbilityName,
          stats
        };
      });

      res.json({ team: updatedTeam });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

teamsRouter.delete("/:pokemonId", async (req, res) => {
  try {
    // Delete the user's Pokemon from the database
    const userId = req.user.id;
    const pokemonId = req.params.pokemonId;

    // Check if authenticated user has the Pokemon in their team
    const userPokemon = await UserPokemon.query()
      .findOne({ userId: userId, pokemonId: pokemonId });
    if (!userPokemon) {
      return res.status(404).json({ message: "Pokemon not found in team" });
    }

    // Delete the link between the user and the Pokemon
    await UserPokemon.query().deleteById(userPokemon.id);

    // Redirect the user to the team page with the updated team
    // res.redirect("/team");

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default teamsRouter;
