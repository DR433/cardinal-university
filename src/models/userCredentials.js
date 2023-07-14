// import the modules
require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// declare the necessary variables


// define the schema
const credentialsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 3,
        required: [true, "Please Enter your First Name"]
    },
    surName: {
        type: String,
        required: [true, "Please Enter your Last Name"]
    },
    email: {
        type: String,
        required: false,
        unique: [true, "This Email Already Exists"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please Enter a valid Email.");
            }
        }
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password."],
        min: 8
    },
    cPassword: {
        type: String,
        required: [true, "Please Confirm Your Password."],
        min: 8
    }, 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// Making a middleware to authorize a user using jsonwebtoken
credentialsSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        const tokenSaved = await this.save(); 
        return token;
    } catch (error) {
        console.error("Jwt signing process could not be finished due to some errors.");
    }
}


// using middleware to hash the password field just before the information is saved in the database
credentialsSchema.pre("save", async function (next) {
    // this condition is to hash the password that is brand new or was recently modified by the user, sort of when the user uses the forget password...
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            this.cPassword = await bcrypt.hash(this.cPassword,10);
        }
        next();
    } catch (error) {
        console.error("The hashing could not be generated due to some problems.");
    }
})


// define the collection
const CredentialsCollection = new mongoose.model("CredentialsCollection", credentialsSchema);



// export the collection 
module.exports = CredentialsCollection;