const User=require("../models/user");


module.exports.renderSignForm = (req,res)=>{
    res.render("users/signup.ejs");
 }

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    // console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            next();
        }
        req.flash("success","welcome to wonderlust!");
        res.redirect("/listings");
    })
    
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//render login form
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs"); 
}
