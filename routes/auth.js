// Importing the necessary modules and environmental variables
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
require("dotenv").config({ path: "./privateValues.env" });

// Creating a new Express Router instance
const router = express.Router();

// Route to register a new user
router.post("/register", async (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Check if a user with the same username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ error: "Username already exists" });

  // Create a new user instance and save it to the database
  const user = new User({ username, password });
  await user.save();

  // Respond with a success message
  res.status(201).json({ message: "Registration successful" });
});

// Route to authenticate a user and create a new session
router.post("/login", async (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username });
  if (!user)
    return res.status(400).json({ error: "Invalid username or password" });

  // Verify the password
  user.verifyPassword(password, async (err, isMatch) => {
    if (err || !isMatch)
      return res.status(400).json({ error: "Invalid username or password" });

    // Create a new JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create a new session and save it to the database
    const session = new Session({
      userId: user._id,
      sessionToken: token,
      expiry: new Date(Date.now() + 60 * 60 * 1000),
    });
    await session.save();

    // Respond with the token
    res.json({ token });
  });
});

// Route to invalidate a session (logout)
router.post("/logout", async (req, res) => {
  // Extract the token from the request body
  const { token } = req.body;

  // Find the session in the database
  const session = await Session.findOne({ sessionToken: token });
  if (!session) return res.status(400).json({ error: "Invalid session" });

  // Check if session exists before attempting to remove
  if (session) {
    // Remove the session from the database
    await Session.deleteOne({ _id: session._id });

    // Respond with a success message
    res.json({ message: "Logout successful" });
  } else {
    res.status(400).json({ error: "Session not found" });
  }
});

// Export the router to be used in the server setup
module.exports = router;
