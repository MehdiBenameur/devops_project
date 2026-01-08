const express = require("express");
const router = express.Router();
const client = require("../grpc/client");

router.get("/player/:id", (req, res) => {
  client.GetPlayer({ id: req.params.id }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
});

router.post("/player", (req, res) => {
  const { name, position, age, photoUrl } = req.body;
  client.CreatePlayer({ name, position, age, photoUrl }, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
});

module.exports = router;
