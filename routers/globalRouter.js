import express from "express";
import { home, search } from "../controllers/boardController";
import { getJoin, getLogin } from "../controllers/usersController"
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", getJoin);
globalRouter.get("/login", getLogin);
globalRouter.get("/search", search);

export default globalRouter;