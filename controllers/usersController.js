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
    req.session.destroy();
    return res.redirect("/")
}

export const see = (req,res) =>{
    return res.render("See Users");
}

export const getEdit = (req,res) =>{
    return res.render("edit-profile");
}

export const postEdit = async (req,res) =>{
    const {
        session: {
            user: { _id, avatar, email: sessionEmail, username: sessionUsername },
        },
        body: { name, email, username, region },
        file,
    } = req;
    let searchParam = [];
    if(sessionEmail !== email){
        searchParam.push({email});
    }
    if(sessionUsername !== username){
        searchParam.push({username});
    }
    if(searchParam.length > 0){
        const foundUser = await User.findOne({ $or: searchParam });
        if(foundUser && foundUser._id.toString() !== _id){
            return res.status(400).render("edit-profile", {
                errorMessage: "이미 있는 아이디나 이메일 입니다 ❌",
            });
        }
    }

    const updateUser = await User.findByIdAndUpdate(
        _id,
        {
            avatar: file ? file.path : avatar,
            name,
            email,
            username,
            region,
        },

        { new: true }
    );

    req.session.user = updateUser;

    return res.redirect("/");
}

export const remove = (req,res) =>{
    return res.render("Delete Users");
}

/*============naverSocial=================*/
//let api_url = "";

export const naverLogin = (req,res) =>{
    const config = {
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        state: process.env.RANDOM_STATE,
        redirectURI: process.env.MY_CALLBACK_URL,
    };

    const {client_id, client_secret, state, redirectURI } = config;

    const api_url =
        "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id="+
        client_id +
        "&redirect_uri=" +
        redirectURI +
        "&state=" +
        state;

        //res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
        return res.redirect(api_url);
}

// export const getNaverCallback = (req,res) =>{
//     return res.redirect("/user/member");
// }

export const naverCallback = async (req,res) =>{
    const baseUrl = "https://nid.naver.com/oauth2.0/token";
    const grantType = "grant_type=authorization_code";
    const config = {
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        redirectURI: process.env.MY_CALLBACK_URL,
        state: req.query.state,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = '${baseUrl}?${grantType}&${params}';
    const tokenRequest = await(
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const apiUrl = "https://openapi.naver.com/v1/nid/me";
        const allData = await(
            await fetch('${apiUrl}', {
                headers: {
                    Authorization: 'Bearer ${access_token}',
                },
            })
        ).json();

        if(!allData.response.email){
            return res.redirect("/login");
        }
        const existingUser = await User.findOne({email: allData.response.email});
        if(existingUser){
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
        } else {
            const user = await User.create({
                name: allData.response.name ? allData.response.name : "Unknown",
                username: allData.response.nickname,
                email: allData.response.email,
                password: "",
                socialOnly: true,
                region: "korea",
            });

            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } else {
        return res.redirect("/login");
    }
};

// export const getNaverMember = (req,res) =>{
//     return res.redirect("/");
// }

// export const postNaverMember = (req,res) =>{
//     api_url = "https://openapi.naver.com/v1/nid/me";
//     let request = require("request");
//     let token = req.body.token;
//     let header = "Bearer " + token;     //Bearer 다음에 공백 추가
//     let options = {
//         url: api_url,
//         headers: {Authorization: header},
//     };

//     request.get(options, function (error, response, body){
//         if(!error && response.statusCode == 200){
//             res.writedHead(200, {"Content-Type": "text/json;charset=utf-8"});
//             res.end(body);
//         } else {
//             console.log("error");
//             if(response != null){
//                 res.status(response.statusCode).end();
//                 console.log("error = " + response.statusCode);
//             }
//         }
//     });
//};