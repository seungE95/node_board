import mongoose from "mongoose";
require('dotenv').config();
const{ PORT, DB_URL } = process.env;

const db = mongoose
    .connect(process.env.DB_URL)
    .then((res) => console.log("Connected to DB 🎄"))
    .catch((err) => console.log(err));

// const{ DB_URL } = process.env;

// mongoose.connect(process.env.DB_URL);

// const db = mongoose.connection;

// const handleOpen = () => console.log("Connected to DB 🎄");
// const handleError = (error) => console.log("DB Error", error);
// db.on("error", handleError);
// db.once("open", handleOpen);