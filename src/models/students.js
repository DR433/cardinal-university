// importing the necessary modules for work
const mongoose = require('mongoose');
const validator = require('validator');


// Creating a schema
const studentsDataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please Enter Your First Name"],
        minLength: [3, "Name Should Contain More Than 2 Letters"]
    },
    lastName: {
        type: String,
        required: [true, "Please Enter Your Last Name"],
    },
    fatherName: {
        type: String,
        required: [true, "Please Enter Your father's Name"],
    },
    motherName: {
        type: String,
        required: [true, "Please Enter Your mother's Name"],
    },
    address: {
        type: String, 
        required: [true, "Please Enter Your Current Address"]
    },
    gender: {
        type: String,
        required: [true, "Enter Your Gender"]
    },
    state: {
        type: String,
        required: [true, "Please Enter Your Current State"]
    },
    city: {
        type: String, 
        required: [true, "Please Enter Your Current City"]
    },
    dob: {
        type: Date,
        required: [true, "Please Enter Your Date Of Birth"]
    },
    age: {
        type: Number,
        required: [true, "Please Enter Your Age"]
    },
    phone: {
        type: Number,
        required: [true, "Please Enter Your Phone Number"],
        unique: [true, "Phone Number Already Exists"],
        min: 10
    },
    pinCode: {
        type: Number,
        required: [true, "Please Enter Your Postal Code"]
    },
    courses: {
        type: String,
        required: [true, "Please Enter Your Course Name"]
    },
    email: {
        type: String,
        required: false,
        unique: [true, "Email Already Exists"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    }
});



// Creating a model for the database Schema
const StudentsDocument = new mongoose.model("StudentsDocument", studentsDataSchema);


// Once the collection is made , Export the model
module.exports = StudentsDocument;
