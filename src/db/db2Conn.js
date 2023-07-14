// adding the modules for mongoose
require('dotenv').config();
const mongoose = require('mongoose');

// creating the necessary variables

// Function the export the connection method
const connectToDatabase = ()=>{

    // Establishing the connection
    mongoose.connect(process.env.URI).then(()=>{
        console.log("Connection Successful....");
    }).catch((error)=>{
        console.error(error.stack);
    })
}

// exporting the module
module.exports = connectToDatabase;




