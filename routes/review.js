const express =require("express");
const router = express.Router({mergeParams: true});
const wrapASync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const reviewController=require("../controllers/review.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
 
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//post rout for reviews
router.post("/",isLoggedIn,validateReview, wrapASync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapASync(reviewController.destroyReview));

module.exports=router;