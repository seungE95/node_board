import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxLength:30},
    content: {type: String, required: true, trim: true, maxLength: 300},
    createdAt: {type: Date, required: true, default: Date.now},
    imgUrl: {type : String, trime: true},
    meta: {
        views: {type: Number, default:0, required: ture},
        rating: {type: Number, default:0, required: true},
    },
});

const Board = mongoose.model("Board", boardSchema);
export default Board;