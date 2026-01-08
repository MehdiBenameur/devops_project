const express = require("express");
const router = express.Router();
const matchClient = require("../grpc/matchClient");
const playerClient = require("../grpc/Client");

// GET All Matches with players
router.get("/all-matches", (req, res) => {
  matchClient.GetAllMatches({}, async (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    const matches = await Promise.all(
      data.matches.map(async (match) => {
        // Récupérer les infos joueurs
        const players = await Promise.all(
          match.players.map(
            (playerId) =>
              new Promise((resolve) => {
                playerClient.GetPlayer({ id: playerId }, (err, player) => {
                  if (err) {
                    resolve({ name: "Unknown", photoUrl: "https://via.placeholder.com/50" });
                  } else {
                    console.log("Player récupéré :", player);
                    resolve(player);
                  }
                });
              })
          )
        );

        return {
          ...match,
          players,
        };
      })
    );

    res.json(matches);
  });
});

// GET Match by ID
router.get("/match/:id", (req, res) => {
  matchClient.GetMatch({ id: req.params.id }, (err, match) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(match);
  });
});

// POST Create Match
router.post("/match", (req, res) => {
  const {
    homeTeam,
    awayTeam,
    date,
    homeTeamLogoUrl,
    awayTeamLogoUrl,
    players
  } = req.body;

  matchClient.CreateMatch(
    {
      homeTeam,
      awayTeam,
      date,
      homeTeamLogoUrl,
      awayTeamLogoUrl,
      players,
    },
    (err, match) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(match);
    }
  );
});

module.exports = router;
