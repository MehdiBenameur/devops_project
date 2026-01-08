const express = require("express");
const router = express.Router();
const scoreClient = require("../grpc/scoreClient");
const playerClient = require("../grpc/Client");
// POST Add Score
router.post("/score", (req, res) => {
  const { matchId, team, minute, playerId } = req.body;
  scoreClient.AddScore({ matchId, team, minute, playerId }, (err, score) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(score);
  });
});

// GET All Scores
router.get("/all-scores", (req, res) => {
  scoreClient.GetAllScores({}, async (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    const scores = await Promise.all(
      data.scores.map(async (score) => {
        return new Promise((resolve) => {
          playerClient.GetPlayer({ id: score.playerId }, (err, player) => {
            if (err) {
              resolve({ ...score, playerName: "Unknown" });
            } else {
              resolve({ ...score, playerName: player.name });
            }
          });
        });
      })
    );

    res.json(scores);
  });
});



module.exports = router;
