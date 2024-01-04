const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
//const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");

const sessionOptions = {secret:"mysecretstring",resave:false,saveUninitialized:true};
app.use(session(sessionOptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


// app.use(cookieParser("secretcode"));

// // Route to create signed cookies
// app.get("/getsignedcookies",(req,res) =>
// {
//     res.cookie("Made in","India",{signed:true});
//     res.send("signed cookie send");
// });

// // Route to verify signed ccokie
// app.get("/verify",(req,res) =>
// {
//     console.log(req.signedCookies);
//     res.send("Verified");
// });


app.listen(3000,() =>
{
    console.log("server is listening to port 3000");
});

app.use((req,res,next) =>
{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();

});

app.get("/register",(req,res) =>
{
    let {name = "anonymous"} = req.query;
    //console.log(req.session);
    req.session.name = name;
    if(name === "anonymous")
    {
        req.flash("error","user not registered!");
    }else{
        req.flash("success","user registered successfully!");

    }
    
    res.redirect("/hello");
    

});

app.get("/hello",(req,res) =>
{
    //console.log(req.flash("success"));
    //res.send(`Hello!,${req.session.name}`);
    
    res.render("page.ejs",{name:req.session.name});
});


app.get("/test",(req,res) =>
{
    res.send("test successfull");
});


// app.get("/getcookies",(req,res) =>
// {
//     res.cookie("greet","hello");
//     res.send("Send you some cookies.");
// });

// app.get("/",(req,res) =>
// {
//     console.dir(req.cookies);
//     console.log("Iam a root");
// });

