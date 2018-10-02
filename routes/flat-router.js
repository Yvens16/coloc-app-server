const express = require("express");

const User = require("../models/user-model.js");
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

  const owner = req.user._id;

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
    picture,
    owner
  })
    .then(flatDoc => res.json(flatDoc))
    .catch(err => next(err));
});

router.get("/my-flats", (req, res, next) => {
  Flat.find({ owner: { $eq: req.user._id } })
    .sort({ createdAt: -1 }) //newest phone first (reverse order)
    .then(flatResults => res.json(flatResults))
    .catch(err => next(err));
});

router.get("/flats/:id", (req, res, next) => {
  const { id } = req.params;
  Flat.findById(id)
    .then(flatDoc => res.json(flatDoc))
    .catch(err => next(err));
});

module.exports = router;
