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

export default homepageRouter;
