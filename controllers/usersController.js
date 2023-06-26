import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req,res) =>{
    return res.render("join");
}

export const postJoin = async (req,res) =>{
    const {name, username, email, password, password2, region} = req.body;

    if(password !== password2){
        return res.status(400).render("join",{
            errorMessage: "비밀번호가 일치하지 않습니다 ❌",
        });
    }

    const validationChecker = await User.exists({
        $or: [{username},{email}],
    });

    if(validationChecker){
        return res.status(400).render("join",{
            errorMessage: "이미 사용중인 이름/이메일 입니다 ❌",
        });
    }

    try {
        await User.create({
            name,
            username,
            email,
            password,
            region,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join",{
            errorMessage: error._message,
        });
    }
};

export const getLogin = (req,res) =>{
    return res.render("Login");
}

export const postLogin = async (req,res) =>{
    const {username, password} = req.body;
    const user = await User.findOnd({username});  
    if(!user){
        return res
            .status(400)
            .render("login", { errorMessage: "아이디 / 비밀번호가 틀렸습니다 ❌"});
    }
    const validationCheck = await bcrypt.compare(password, user.password); //bcrypt 해시 암호화 알고리즘

    if(!validationCheck){
        return res.status(400).render("login", {
            errorMessage: "아이디 / 비밀번호가 틀렸습니다 ❌",
        });
    }
    req.seesion.loggedIn = true;
    req.ssesion.user = user;
    return res.redirect("/");
}

export const logout = (req,res) =>{
    return res.send("Log out ☕")
}

export const see = (req,res) =>{
    return res.render("See Users");
}

export const edit = (req,res) =>{
    return res.render("Edit Users");
}

export const remove = (req,res) =>{
    return res.render("Delete Users");
}