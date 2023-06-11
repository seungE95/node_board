export const join = (req,res) =>{
    return res.render("Join");
}

export const login = (req,res) =>{
    return res.render("Login");
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