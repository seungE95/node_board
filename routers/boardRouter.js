import express from "express";
import {
    getSeeBoard,
    getEditBoard,
    getDeleteBoard,
    getWriteBoard,
    postWriteBoard,
    postEditBoard, 
} from "../controllers/boardController";
const boardRouter = express.Router();

boardRouter.route("/write").get(getWriteBoard).post(postWriteBoard);
boardRouter.get("/:id", getSeeBoard);
boardRouter.route("/:id/edit").get(getEditBoard).post(postEditBoard);
boardRouter.get("/:id/delete", getDeleteBoard);

export default boardRouter;