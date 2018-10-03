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

// See the room list with "normal" user
router.get("/flats", (req, res, next) => {
  Flat.find()
    .sort({ createdAt: -1 }) //newest flat first
    .then(flatResult => res.json(flatResult))
    .catch(err => next(err));
});

// See flat-list of one owner
router.get("/my-flats", (req, res, next) => {
  Flat.find({ owner: { $eq: req.user._id } })
    .sort({ createdAt: -1 }) //newest phone first (reverse order)
    .then(flatResults => res.json(flatResults))
    .catch(err => next(err));
});

// See details of one flat with id
router.get("/flats/:id", (req, res, next) => {
  const { id } = req.params;
  Flat.findById(id)
    .then(flatDoc => res.json(flatDoc))
    .catch(err => next(err));
});

// Remove one flat
router.delete("/flats/:id", (req, res, next) => {
  const { id } = req.params;
  Flat.findByIdAndRemove(id)
    .then(flatDoc => res.json(flatDoc))
    .catch(err => next(err));
});

router.put("/flats/:id", (req, res, next) => {
  const { id } = req.params;
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

  Flat.findByIdAndUpdate(
    id,
    {
      $set: {
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
      }
    },
    // "new" gets the updated version of the document
    { runValidators: true, new: true }
  )
    .then(flatDoc => res.json(flatDoc))
    .catch(err => next(err));
});

module.exports = router;
