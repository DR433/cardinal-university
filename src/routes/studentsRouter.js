// important modules to require
const express = require('express');
const StudentsDocument = require('../models/students');
const CredentialsCollection = require('../models/userCredentials');
const bcrypt = require('bcryptjs');
const authentication = require('../middleware/authentication');

// important variable declaration 
const router = express.Router();


// Home Page to load
router.get('/', (request, response) => {
    response.render('index');
})

// This is aboutUs page
router.get("/about", authentication, (request, response) => {
    response.render("about");
})

// This is registration page
router.get("/registration", (request, response) => {
    response.render("registration");
})

// This is login page
router.get("/login", (request, response) => {
    response.render("login");
})

// This is signup page
router.get("/signup", (request, response) => {
    response.render("signup");
})

// This is login page but a post request one
router.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await CredentialsCollection.findOne({ email });
        const comparePassword = await bcrypt.compare(password, user.password);

        if (!user) {
            response.status(200).render("login");
        } else {
            if (!comparePassword) {
                response.status(200).render("login");
            } else {
                // generating the jwttoken for authorization
                const generatedToken = await user.generateAuthToken();


                // saving the jwttoken into the cookies
                response.cookie("jwt", generatedToken, {
                    expires: new Date(Date.now() + 40 * 1000),
                    httpOnly: true
                });
                response.status(200).render("index");
            }
        }
    } catch (error) {
        console.error(error.message);
        response.status(400).render("login");
    }
})

// This is signup page but a post request one
router.post("/signup", async (request, response) => {
    try {
        const { firstName, surName, email, password, cPassword } = request.body;
        const userCredentials = await new CredentialsCollection({
            firstName: firstName,
            surName: surName,
            email: email,
            password: password,
            cPassword: cPassword
        });

        // saves the data in the database if the password and the confirm password matches and if not then you don't get to save the data
        if (password === cPassword) {
            // authorize the newStudent with the jsonwebtoken
            const generatedToken = await userCredentials.generateAuthToken();

            // saving the generatedToken into cookies
            response.cookie("jwt", generatedToken, {
                expires: new Date(Date.now() + 40 * 1000),
                httpOnly: true
            });

            const user = await userCredentials.save();
            response.status(200).render("login");
        } else {
            response.status(400).render("signup");
        }
    } catch (error) {
        console.error(error.message);
        response.status(400).render("signup");
    }
})

// adding a logout route
router.get("/logout", authentication, async (request, response)=>{
    try {
        request.user.tokens = request.user.tokens.filter((tokenObject)=>{
            return tokenObject.token !== request.token;
        })
        response.clearCookie('jwt');
        await request.user.save();
        response.status(200).render("login");
    } catch (error) {
        console.error(error.message);
        response.status(400).render("index");
    }
})

// Student page to load using async await for post request
router.post("/students", async (request, response) => {
    try {
        // destructure the request body
        const { firstName, lastName, fatherName, motherName, address, gender, city, state, dob, age, phone, pinCode, courses, email } = request.body;

        // make a new student registration form
        const newStudent = new StudentsDocument({
            firstName: firstName,
            lastName: lastName,
            fatherName: fatherName,
            motherName: motherName,
            address: address,
            gender: gender,
            city: city,
            state: state,
            dob: dob,
            age: age,
            phone: phone,
            pinCode: pinCode,
            courses: courses,
            email: email
        });


        // save the student data into the database
        const student = await newStudent.save();
        response.status(201).render("registrationSuccess");
    } catch (error) {
        response.status(400).render("registeredAlready");
    }
})

// Student page to load using async await for get request
router.get("/students", async (request, response) => {
    try {
        const users = await StudentsDocument.find();
        response.status(200).json(users);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
})

// student page to load using async await for get request for individual data
router.get("/students/:id", async (request, response) => {
    try {
        const userData = await StudentsDocument.findById(request.params.id);
        if (userData) {
            response.status(200).json(userData);
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
})

// student page to load using async await for patch request for individual data in order to update
router.patch("/students/:id", async (request, response) => {
    try {
        const updateStudentData = await StudentsDocument.findByIdAndUpdate(request.params.id, request.body, {
            new: true
        });
        if (updateStudentData) {
            response.status(200).json(updateStudentData);
        } else {
            response.status(400).json({ error: "Data Updation Unsuccessful." });
        }
    } catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
})

// Student page to load using async await for delete request for individual data in order to delete
router.delete("/students/:id", async (request, response) => {
    try {
        const deleteStudentData = await StudentsDocument.findByIdAndDelete(request.params.id);
        if (deleteStudentData) {
            response.status(200).json(deleteStudentData);
        } else {
            response.status(400).json({ error: "No Such Data Found" });
        }
    } catch (error) {
        response.status(500).json({ error: "Internal Server Error!!" });
    }
})

// Pages that does not exist
router.get('*', (request, response) => {
    let requestedPage = request.url;
    let pageNameFirstLetter = requestedPage.slice(1, 2).toUpperCase();
    let pageNameWithoutFirstLetter = requestedPage.slice(2, requestedPage.length);
    let pageName = pageNameFirstLetter.concat(pageNameWithoutFirstLetter);
    response.render("404", {
        pageName: `${pageName}`
    });
})

module.exports = router;