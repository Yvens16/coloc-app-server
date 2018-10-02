const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const flatSchema = new Schema(
  {
    //document structure
    streetNum: { type: Number, required: true },
    address: { type: String, required: true },
    zipCode: { type: Number, required: true },
    rent: { type: Number, required: true },
    roomMate: { type: Number, required: true },
    housing: {
      type: String,
      enum: [
        "Studio",
        "Appartment",
        "Duplex",
        "Loft",
        "House",
        "cabine",
        "Chalet",
        "Boat",
        "Farm"
      ],
      required: true
    },
    roomNum: { type: Number, required: true },
    area: { type: Number, required: true },
    description: { type: String, required: true },
    picture: { type: Array },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Flat = mongoose.model("Flat", flatSchema);

module.exports = Flat;

