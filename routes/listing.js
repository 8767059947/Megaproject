const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const{listingSchema} = require("../schema.js");
const{reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isUser} = require("../views/middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../Controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })



//Index route
router.get("/",wrapAsync(listingController.index));

// New route 
router.get("/new",isLoggedIn,listingController.new);

//Show route - har individual listing ka pura data printout karwana.
router.get("/:id", wrapAsync(listingController.show));

// Create routr
router.post("/",isLoggedIn,upload.single("listing[image]"),wrapAsync (listingController.create));
// router.post("/", upload.single('listing[image]'),(req,res) =>
//     {
//         res.send(req.file);
//     });

// Edit route
router.get("/:id/edit",isLoggedIn,isUser,wrapAsync (listingController.edit));

// Update route
router.put("/:id",isLoggedIn,isUser,upload.single("listing[image]"), wrapAsync(listingController.update));

// Delete rote
router.delete("/:id",isLoggedIn, isUser,wrapAsync(listingController.delete));


module.exports = router;
