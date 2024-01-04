const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveUrl } = require("../views/middleware.js");
const userController = require("../Controllers/users.js");

router.get("/signup",(userController.createUser));

router.post("/signup",wrapAsync(userController.signUp));

router.get("/login",userController.renderLogin);

router.post("/login",saveUrl,
passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
userController.logIn,
);

// Logout Route
router.get("/logout",userController.logOut);


module.exports = router