const express = require("express");
if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}
console.log(process.env.SECRET);
const {isLoggedIn,isUser,isAuthor} = require("./views/middleware.js");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const{listingSchema} = require("./schema.js");
const Review = require("./models/review.js");
const{reviewSchema} = require("./schema.js");
const listings = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const reviewController = require("./Controllers/review.js");
const dburl = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter:24 * 3600,

});
store.on("error",() =>
{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 *24 *60 *60 *1000,
        maxAge: 7 *24 *60 *60 *1000,
        httpOnly:true,

    }
};





main().then(() =>
{
    console.log("connected to DB.");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new Localstrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get("/",(req,res) =>
{
    res.send("Hi iam root..");
});

// const validateError = (req,res,next) =>
// {
//     let {error} = listingSchema.validate(req.body);
    
//     if(error)
//     {
//         throw new ExpressError(400,result.error);
//     }
//     else{
//         next();
//     }
// };

const validateReview = (req,res,next) =>
{
    let {error} = reviewSchema.validate(req.body);
    
    if(error)
    {
        throw new ExpressError(400,result.error);
    }
    else{
        next();
    }
};

app.listen(8080,() =>
{
    console.log("server is listening");
});

// app.get("/testListing",async (req,res) =>
// {
//     let sample = new Listing(
//         {
//            title:"My new villa",
//            description:"By the beach",
//            price:1200,
//            location:"Calangute,goa",
//            country:"India" 
//         }
//     );
//    await sample.save();
//    console.log("Sample was saved");
//    res.send("successful testing");


// });
app.use((req,res,next) =>
{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    //console.log(res.locals.success);
    next();
});

// app.get("/demouser",async(req,res) =>
// {
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"DeltaStudent"
//     });
//     // register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. 
//     let registeredUser = await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listings);
app.use("/",userRouter);




// Review Route
app.post("/listings/:id/reviews",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete review route
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));


app.all("*",(req,res,next) =>
{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next) =>
{
    let {statusCode = 500,message = "Something went wrong !"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});















