if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");



app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});
store.on("error",()=>{
console.log("error mongo session store",err);
});
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 *24*60*60*1000,
        maxAge: 7 *24*60*60*1000,
        httpOnly: true,
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



// app.get("/demouser",async(req,res)=>{
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// }); 



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="some wrong"}=err;
    // res.status(status).send("something wrong");
    res.render("error.ejs",{message});
});

//reviews post routs



//middleware
// app.use((err,req,res,next)=>{
//     res.send("something wrong");
// });

app.listen(8080,()=>{
    console.log("listening on 8080");
});