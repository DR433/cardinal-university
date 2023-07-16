// require the necessary modules
const jwt = require('jsonwebtoken');
const  CredentialsCollection = require('../models/userCredentials');


// declare the necessary variables and functions 
const authentication = async(request, response, next) => {
    try {
        // bring the token that is given to this page and verify it
        const token = request.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const userInfo = await CredentialsCollection.findOne({_id: verifyToken._id});
        request.token = token;
        request.user = userInfo;
        next()
    } catch (error) {
        console.error(error.message);
        response.status(400).render("unAuthorized");
    }
}


// export the function or object or variable to use in another place
module.exports = authentication;