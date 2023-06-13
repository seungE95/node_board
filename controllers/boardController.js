import { render } from "pug";

export const home = async (req, res) => {
    const {id} = req.params;
    const boards = await Board.find({}).sort({createAt: "desc"});
    return res.render("home", {boards});
}

export const search = async (req, res) => {
    const {kyword} = req.query;
    let boards = [];
    if(keyword){
        boards = await Board.find({
            title: {
                $regex: new RegExp(keyword,"i")
            },
        });
    }
    return res.render("search",{boards});
}

export const getSeeBoard = async (req, res) => {
    const {id} = req.params;
    const board = await Board.findById(id);
    if(!board){
        return res.render("404", {pageTitle: "Page Not Found"});
    }
    return res.render("watch", {board, pageTitle: "Watch"});
}

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
    return res.render("Write");
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

let boards = [
    {
        id: 1,
        title: "1st board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 2,
        title: "2nd board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 3,
        title: "3rd board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 4,
        title: "4th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 5,
        title: "5th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 6,
        title: "6th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 7,
        title: "7th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 8,
        title: "8th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 9,
        title: "9th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
    {
        id: 10,
        title: "10th board",
        text: "Node.js simple project 입니다 📝",
        imgUrl: "/image/Node.js.png",
    },
];