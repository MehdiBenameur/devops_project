const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  team: { type: String, required: true },
  minute: { type: Number, required: true },
  playerId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Score", scoreSchema);
