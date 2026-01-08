const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  date: { type: Date, required: true },
  homeTeamLogoUrl: { type: String },
  awayTeamLogoUrl: { type: String }, 
  players: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);
