// Importing the mongoose module to handle MongoDB data
const mongoose = require("mongoose");
// Importing the bcrypt module for password hashing
const bcrypt = require("bcrypt");

// Creating a new mongoose schema for users.
// The schema defines the structure of the documents in the MongoDB collection.
const UserSchema = new mongoose.Schema({
  // 'username' field will store the user's username. This field is unique and required.
  username: { type: String, required: true, unique: true },

  // 'password' field will store the user's password. This field is required.
  password: { type: String, required: true },
});

// Hash the password before saving it
// This is a pre-save hook, which will run before the data is saved to MongoDB
UserSchema.pre("save", function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Generate a hash for the password
  // 'next' is a callback that it is called when an asynchronous operation completes.
  // It's provided by Mongoose and is used to signal that the middleware function has
  // done its work and that Mongoose can move on to the next middleware or to save the
  // document to the database if there are no more middleware functions to execute.
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    // Replace the plain-text password with the hash
    user.password = hash;
    next();
  });
});

// Method to verify password
// This method is used to check if an entered password matches the stored, hashed password
UserSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Exporting the User model.
// The first argument is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural, lowercased version of your model name.
// Thus, for the model User the collection 'users' will be created in MongoDB.
module.exports = mongoose.model("User", UserSchema);
