const mongoose=require("mongoose");
const initdata=require("./data.js");


mongoose.connect('mongodb://127.0.0.1:27017/wonder')
.then(() => console.log('Connected'));

const listingSchema=new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    description: String,
    image:{
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Listing=mongoose.model("Listing",listingSchema);


const initDB= async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj, owner: "6578109cc778594789587b0b"}));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}
initDB();