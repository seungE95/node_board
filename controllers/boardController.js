import { render } from "pug";
import Board from "../models/Board";

export const home = async (req, res) => {
    const { id } = req.params;
        const boards = await Board.find({}).sort({ createdAt: "desc" });
        return res.render("home", {boards});
}

export const search = async (req, res) => {

    const {keyword} = req.query;
    let boards = [];
    if(keyword){
        boards = await Board.find({
            title: {
                $regex: new RegExp(keyword,"i") //정규화 대소문 구분x
            },
        });
    }
    return res.render("search",{boards});
}

export const getSeeBoard = async (req, res) => {
    const { id } = req.params;
    const board = await Board.findById(id);
    if (!board) {
    return res.render("404", { pageTitle: "Page Not Found" });
    }
    return res.render("watch", { board, pageTitle: "Watch" });
};

export const getEditBoard = async (req, res) => {
    const {id} = req.params;
    const board = await Board.findById(id);
    if(!board){
        return res.render("404", {pageTitle: "Page Not Found"});
    }
    return res.render("edit", {board, pageTitle: "Edit"});
}

export const postEditBoard = async (req, res) => {
    const {
        params: { id },
        body: { title, content, boardImg },
        file,
    } = req;
    
    const board = await Board.findById(id);
    if(!board){
        return res.render("404", {pageTitle: "Page Not Found"});
    }
    await Board.findByIdAndUpdate(id, {
        title,
        content,
        boardImg: file ? file.path : boardImg,
    });
    return res.redirect("/board/${id}");
};

export const getWriteBoard = (req, res) => {
    return res.render("write");
};

export const postWriteBoard = async (req, res) => {
    const { 
        user: { _id },
    } = req.session;
    
    const {
        body: { title, content, boardImg },
        file,
    } = req;
    const isHeroku = process.env.NODE_ENV === "production";

    try {
        const newBoard = await Board.create({
            title,
            content,
            owner: _id,
            boardImg: file ? (isHeroku ?  file.location : file.path) : boardImg,
        });
        const user = await User.findById(_id);
        user.boards.push(newBoard._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("write", {
            errorMessage: error._message,
            pageTitle: "Write",
        });
    }
};

export const getDeleteBoard = async(req, res) => {
    const {id} = req.params;
    await Board.findByIdAndDelete(id);
    return res.render("/");
}

