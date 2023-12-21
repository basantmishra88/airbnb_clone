const express =require("express");
const router = express.Router();
const wrapASync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//render for create listings
router.get("/new",isLoggedIn,listingController.renderNewForm);

//index rout
router.get("/",wrapASync(listingController.index));

//show rout
router.get("/:id",wrapASync(listingController.showListing));


//create rout
router.post("/",isLoggedIn,
upload.single("listing[image]"),
validateListing,
wrapASync(listingController.createListing));


//edit rout
router.get("/:id/edit",isLoggedIn,wrapASync(listingController.renderEditForm));
//update rout
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapASync(listingController.updateListing));
//delete rout
router.delete("/:id",isLoggedIn,isOwner,wrapASync(listingController.destroyListing));

module.exports=router;