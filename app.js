const express = require("express");
const mongoose = require("mongoose");
const logger = require("./middlewares/logger")
const {notFound,errorHandler} = require("./middlewares/error")
const ConnectToDB = require("./config/db");
const dotenv = require("dotenv").config()


// Conntection  to MongoDB database
ConnectToDB()



const app = express();

app.use(express.json()); // middleware for parsing JSON and populating req.body
app.use(logger);

// Routes
app.use("/api/books",require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));


// Error Handler Middleware
app.use(notFound); 
app.use(errorHandler);



const PORT = 5000;
app.listen(PORT, () => console.log(`server is running in port ${PORT}`));
