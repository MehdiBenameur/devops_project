const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Match = require("../models/matchModel");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../../proto/match.proto")
);

const matchProto = grpc.loadPackageDefinition(packageDefinition).match;

async function GetMatch(call, callback) {
  try {
    const match = await Match.findById(call.request.id);
    if (match) {
      callback(null, {
        id: match._id.toString(),
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date.toISOString(),
        homeTeamLogoUrl: match.homeTeamLogoUrl || "",
        awayTeamLogoUrl: match.awayTeamLogoUrl || "",
        players: match.players || []
      });
    } else {
      callback({ code: grpc.status.NOT_FOUND, message: "Match not found" });
    }
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function CreateMatch(call, callback) {
  try {
    const newMatch = await Match.create({
      homeTeam: call.request.homeTeam,
      awayTeam: call.request.awayTeam,
      date: call.request.date,
      homeTeamLogoUrl: call.request.homeTeamLogoUrl,
      awayTeamLogoUrl: call.request.awayTeamLogoUrl,
      players: call.request.players
    });

    callback(null, {
      id: newMatch._id.toString(),
      homeTeam: newMatch.homeTeam,
      awayTeam: newMatch.awayTeam,
      date: newMatch.date.toISOString(),
      homeTeamLogoUrl: newMatch.homeTeamLogoUrl || "",
      awayTeamLogoUrl: newMatch.awayTeamLogoUrl || "",
      players: newMatch.players || []
    });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}

async function GetAllMatches(call, callback) {
  try {
    const matches = await Match.find();
    const result = matches.map((match) => ({
      id: match._id.toString(),
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      date: match.date.toISOString(),
      homeTeamLogoUrl: match.homeTeamLogoUrl || "",
      awayTeamLogoUrl: match.awayTeamLogoUrl || "",
      players: match.players || [],
    }));

    callback(null, { matches: result });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
}



module.exports = {
  MatchService: matchProto.MatchService.service,
  GetMatch,
  CreateMatch,
  GetAllMatches,
};
