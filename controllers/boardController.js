import { render } from "pug";
import Board from "../models/Board";

export const home = async (req, res) => {
    const { id } = req.params;
    try {
        const boards = await Board.find({}).sort({ createdAt: "desc" });
        return res.render("home", {boards});
    } catch (error) {
        console.log("error :: "+error);
    }
    return res.render("home");
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
    const {id} = req.params;
    const {title, imgUrl, content } = req.body;
    const board = await Board.findById(id);
    if(!board){
        return res.render("404", {pageTitle: "Page Not Found"});
    }
    await Board.findByIdAndUpdate(id, {title,imgUrl,content});
    return res.redirect("/board/${id}");
}

export const getDeleteBoard = async(req, res) => {
    const {id} = req.params;
    await Board.findByIdAndDelete(id);
    return res.render("/");
}

export const getWriteBoard = (req, res) => {
    return res.render("write");
};

export const postWriteBoard = async (req, res) => {
    const { title, imgUrl, content } = req.body;
    
    try {
        const board = await Board.create({
            title,
            imgUrl,
            content,
        });
        return res.render("/");
    } catch (error) {
        return render("write", {
            errorMessage: error._message,
            pageTitle: "Write",
        });
    }
};