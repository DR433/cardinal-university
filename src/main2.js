// importing any files or modules that is necessary
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectToDatabase = require('./db/db2Conn');
const router = require("./routes/studentsRouter");
const hbs = require('hbs');
const cookieParser = require('cookie-parser');


// important variable declerations
const app = express();
const port = process.env.PORT || 5000;
const partialsPath = path.join(__dirname, "../templates/partials");
const staticPagePath = path.join(__dirname, "../templates/views");
const staticPagePath2 = path.join(__dirname, "../public");


// Adding Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.static(staticPagePath2));
app.use(router);
app.set('view engine', 'hbs');
app.set('views', staticPagePath);
hbs.registerPartials(partialsPath);

// connection establishments with the database
connectToDatabase();


// Start the server
app.listen(port, '127.0.0.1', () => {
    console.log("Server is running on : " + port);
})