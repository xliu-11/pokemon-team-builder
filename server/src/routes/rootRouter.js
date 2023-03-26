import express from "express";
import homepageRouter from "./api/v1/homepageRouter.js";
import pokedexRouter from "./api/v1/pokedexRouter.js";
import teamsRouter from "./api/v1/teamsRouter.js";
import userSessionsRouter from "./api/v1/userSessionsRouter.js";
import usersRouter from "./api/v1/usersRouter.js";
import clientRouter from "./clientRouter.js";

const rootRouter = new express.Router();
rootRouter.use("/", clientRouter);

rootRouter.use("/api/v1/user-sessions", userSessionsRouter);
rootRouter.use("/api/v1/users", usersRouter);
rootRouter.use("/api/v1/teams", teamsRouter);
rootRouter.use("/api/v1/pokedex", pokedexRouter);
rootRouter.use("/api/v1/homepage", homepageRouter)

//place your server-side routes here

export default rootRouter;
