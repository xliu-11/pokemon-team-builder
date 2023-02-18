import express from "express"
import { Team } from "../../../models/index.js";

const teamsRouter = new express.Router()

// POST /api/v1/teams
teamsRouter.post('/', async (req, res) => {
  try {
    const { name, image, type, secondaryType } = req.body;
    const team = new Team({ name, image, type, secondaryType });
    await team.save();
    res.status(201).json({ team });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/teams/:teamId/pokemons/:pokemonId
teamsRouter.delete('/:teamId/pokemons/:pokemonId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    const pokemonIndex = team.pokemons.findIndex(pokemon => pokemon._id.toString() === req.params.pokemonId);
    if (pokemonIndex === -1) {
      res.status(404).json({ error: 'Pokemon not found in team' });
      return;
    }
    team.pokemons.splice(pokemonIndex, 1);
    await team.save();
    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/teams/:id
teamsRouter.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    await team.remove();
    res.status(204).send();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default teamsRouter
