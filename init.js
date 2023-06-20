import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import morgan from "morgan";
import {localsMiddleware} from "./middlewares.js";
import db from "./db";

const app = express();
//const PORT = 8000;
const logger = morgan("dev");
console.log('process.env::::'+process.env);
console.log('process.env.COOKIE_SECRET::::'+process.env.COOKIE_SECRET);
console.log('process.env.DB_URL:::::'+process.env.DB_URL);

app.set("view engine", "pug");  //pug 설정
app.set("views", process.cwd() + "/src/views"); //pug 폴더 설정

app.use(logger);    //morgan middleware 사용
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
    })
);

app.use(localsMiddleware);
app.use("/image", express.static(__dirname + "/image"));    //image 사용
app.use("/static", express.static(__dirname + "/assets"));  //frontend 사용
app.use("/",globalRouter);
app.use("/users",userRouter);
app.use("/board",boardRouter);

export default app;

const handleListener = () => {
    console.log('Hello! lets start http://localhost:${PORT}');
};

app.listen(PORT, handleListener);