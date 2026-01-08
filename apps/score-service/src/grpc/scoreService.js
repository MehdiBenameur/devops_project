const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Score = require("../models/scoreModel");
const sendEvent = require("../kafka/producer");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../../proto/score.proto")
);

const scoreProto = grpc.loadPackageDefinition(packageDefinition).score;

async function AddScore(call, callback) {
  try {
    const newScore = await Score.create({
      matchId: call.request.matchId,
      team: call.request.team,
      minute: call.request.minute,
      playerId: call.request.playerId || null, // ⚽ nouveau champ
    });

    // ⚽ Publish event with player info
    await sendEvent("GOAL", {
      matchId: newScore.matchId,
      team: newScore.team,
      minute: newScore.minute,
      playerId: newScore.playerId,
    });

    callback(null, {
      id: newScore._id.toString(),
      matchId: newScore.matchId,
      team: newScore.team,
      minute: newScore.minute,
      playerId: newScore.playerId || "",
    });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}


async function GetAllScores(call, callback) {
  try {
    const scores = await Score.find();
    const result = scores.map(score => ({
      id: score._id.toString(),
      matchId: score.matchId,
      team: score.team,
      minute: score.minute,
      playerId: score.playerId
    }));
    callback(null, { scores: result });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

module.exports = {
  ScoreService: scoreProto.ScoreService.service,
  AddScore,
  GetAllScores
};
