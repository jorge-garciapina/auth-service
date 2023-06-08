// Importing the mongoose module to handle MongoDB data
const mongoose = require("mongoose");

// Creating a new mongoose schema for sessions.
const SessionSchema = new mongoose.Schema({
  // 'userId' field will store the ObjectId of the user.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 'sessionToken' field will store the JWT token for the session.
  sessionToken: { type: String, required: true },

  // 'expiry' field will store the expiry date of the session.
  expiry: { type: Date, required: true },
});

// Exporting the Session model.
// The first argument is the singular name of the collection.
// Mongoose looks for the plural, lowercased version of the model name.
// Thus, for the model Session the collection 'sessions' will be created in MongoDB.
module.exports = mongoose.model("Session", SessionSchema);
