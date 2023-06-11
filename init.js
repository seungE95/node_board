import express from "express";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import morgan from "morgan";

const app = express();
const PORT = 8000;
const logger = morgan("dev");

app.set("view engine", "pug");  //pug 설정
app.set("views", process.cwd() + "/src/views"); //pug 폴더 설정

app.use(logger);    //morgan middleware 사용
app.use("/image", express.static(__dirname + "/image"));    //image 사용
app.use("/static", express.static(__dirname + "/assets"));  //frontend 사용
app.use("/",globalRouter);
app.use("/users",userRouter);
app.use("/board",boardRouter);

const handleListener = () => {
    console.log('Hello! lets start http://localhost:${PORT}');
};

app.listen(PORT, handleListener);