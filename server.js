// Importing necessary modules, environmental variables, and routes
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config({ path: "./privateValues.env" });

// Initializing our Express app
const app = express();

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) =>
    console.error("Error connecting to MongoDB:", error.message)
  );

// // Enabling JSON parsing in Express
app.use(express.json());

// Adding our auth routes to the Express app
app.use("/auth", authRoutes);

// Starting the server and listening on the specified port
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
