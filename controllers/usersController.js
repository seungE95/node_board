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

export const naverLogin = (req,res) =>{
    const config = {
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        state: process.env.RANDOM_STATE,
        redirectURI: process.env.MY_CALLBACK_URL,
    };

    const {client_id, client_secret, state, redirectURI } = config;

    api_url =
        "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id="+
        client_id +
        "&redirect_uri=" +
        redirectURI +
        "&state=" +
        state;

        //res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
        res.redirect(api_url);
}

export const getNaverCallback = (req,res) =>{
    return res.redirect("/user/member");
}

export const postNaverCallback = (req,res) =>{
    const config = {
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        state: process.env.RANDOM_STATE,
        redirectURI: process.env.MY_CALLBACK_URL,
    };

    const {client_id, client_secret, state, redirectURI } = config;
    const code = req.query.code;
    state - req.query.state;
    api_url =
        'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='+
        client_id +
        "&client_secret=" +
        client_secret +
        "&redirect_uri=" +
        redirectURI +
        "&code=" +
        code +
        "&state=" +
        state;
    let request = require("requeset");
    let options = {
        url: api_url,
        headers: {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
        },
    };

    request.get(options, function(error, response, body){
        if(!error && response.statusCode == 200){
            res.writedHead(200, {"Content-Type": "text/json;charset=utf-8"});
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log("error = " + response.statusCode);
        }
    });
};

export const getNaverMember = (req,res) =>{
    return res.redirect("/");
}

export const postNaverMember = (req,res) =>{
    api_url = "https://openapi.naver.com/v1/nid/me";
    let request = require("request");
    let token = req.body.token;
    let header = "Bearer " + token;     //Bearer 다음에 공백 추가
    let options = {
        url: api_url,
        header: {Authorization: header},
    };

    request.get(options, function (error, response, body){
        if(!error && response.statusCode == 200){
            res.writedHead(200, {"Contnet-Type": "text/json;charset=utf-8"});
            res.end(body);
        } else {
            console.log("error");
            if(response != null){
                res.status(response.statusCode).end();
                console.log("error = " + response.statusCode);
            }
        }
    })
}