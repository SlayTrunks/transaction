const mongoose = require("mongoose");

const connectDb = ()=>{
    mongoose.connect("mongodb+srv://slaytrunks:insane@paytmcluster.gmltq.mongodb.net/").then(console.log("connected")).catch("invalid something");
}

module.exports = connectDb