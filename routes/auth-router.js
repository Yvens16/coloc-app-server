const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  const {
    fisrtName,
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
    fisrtName,
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

module.exports = router;
