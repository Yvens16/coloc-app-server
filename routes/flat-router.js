const express = require("express");

const Flat = require("../models/flat-model.js");

const router = express.Router();

router.post("/flats", (req, res, next) => {
  const {
    streetNum,
    address,
    zipCode,
    rent,
    roomMate,
    housing,
    roomNum,
    area,
    description,
    picture
  } = req.body;

  Flat.create({
    streetNum,
    address,
    zipCode,
    rent,
    roomMate,
    housing,
    roomNum,
    area,
    description,
    picture
  })
    .then(flatDoc => res.json(flatDoc))
    .catch(err => next(err));
});

module.exports = router;
