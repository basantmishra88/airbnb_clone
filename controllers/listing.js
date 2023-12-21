const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    let listings= await Listing.find({});
    res.render("listings/index.ejs",{listings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id)
    .populate({
     path: "reviews",
     populate: {
        path: "author",
     },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing does not Exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}

//post
module.exports.createListing=async (req,res)=>{
    // console.log(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

//edit form
module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not Exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

//update listing
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file != "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Update Listing");
    res.redirect(`/listings/${id}`);
}

//delete listing
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Delete");
    res.redirect("/listings");
}
