import express from "express";
import getClientIndexPath from "../config/getClientIndexPath.js";

const router = new express.Router();

const clientRoutes = ["/", "/pokemon-team-builder", "/pokemon-team-builder/pokedex", "/pokemon-team-builder/details", "/pokemon-team-builder/team", "/user-sessions/new", "/users/new"];
router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath());
});

export default router;
