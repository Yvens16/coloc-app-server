const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  const {
    firstName,
    lastName,
    age,
    sexe,
    job,
    presentation,
    avatar,
    budget,
    email,
    phone,
    originalPassword,
    streetNum,
    address,
    zipCode,
    rent,
    roomMate,
    housing,
    roomNum,
    area,
    description,
    picture,
    role
  } = req.body;

  // encrypt the submitted password
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({
    lastName,
    firstName,
    age,
    sexe,
    job,
    presentation,
    avatar,
    budget,
    email,
    phone,
    encryptedPassword,
    streetNum,
    address,
    zipCode,
    rent,
    roomMate,
    housing,
    roomNum,
    area,
    description,
    picture,
    role
  })
    .then(userDoc => {
      // LOG IN THIS USER
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userDoc, () => {
        // hide "encryptedPassword" before sending the JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // first check to see if there's a document with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      // "userDoc" will be empty if the email is wrong (no document in database)
      if (!userDoc) {
        // create an error object to send to our error handler with "next()"
        next(new Error("Incorrect email!"));
        return; // use "return" instead of a big "else {}"
      }
      // second check the password
      const { encryptedPassword } = userDoc;
      // "compareSync()" will return false if the "originalPassword" is wrong
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // create an error object to send to our error handler with "next()"
        next(new Error("Password wrong!"));
        return;
      }
      // LOG IN THIS USER
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userDoc, () => {
        // hide encrypted password before sending the JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});

router.delete("/logout", (req, res, next) => {
  // "req.logOut()" is a Passport method that removes the user ID from session
  req.logOut();
  res.json({ userDoc: null });
});

router.get("/checklogin", (req, res, next) => {
  if (req.user) {
    // hide encrypted password before sending the JSON (it's a security risk)
    req.user.encryptedPassword = undefined;
    res.json({ userDoc: req.user });
  } else {
    res.json({ userDoc: null });
  }
});

router.get("/profile/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(userDoc => res.json(userDoc))
    .catch(err => next(err));
});

router.put("/profile/:id", (req, res, next) => {
  const { id } = req.params;
  const {
    lastName,
    firstName,
    age,
    sexe,
    job,
    presentation,
    avatar,
    budget,
    email,
    phone,
    originalPassword
  } = req.body;

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.findByIdAndUpdate(
    id,
    {
      $set: {
        lastName,
        firstName,
        age,
        sexe,
        job,
        presentation,
        avatar,
        budget,
        email,
        phone,
        encryptedPassword
      }
    },
    { runValidators: true, new: true }
  )
    .then(userDoc => res.json(userDoc))
    .catch(err => next(err));
});

router.post("/likes/:id", (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user._id;

  User.findByIdAndUpdate(
    id,
    {
      $push: {
        likes: currentUser
      }
    },
    { runValidators: true, new: true }
  )
    .then(userDoc => res.json(userDoc))
    .catch(err => next(err));
});

router.get("/my-likes/:id", (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .populate("likes")
    .then(userDoc => res.json(userDoc))
    .catch(err => next(err));
});

module.exports = router;
