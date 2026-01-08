const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const Player = require("../models/playerModel");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../../proto/player.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const playerProto = grpc.loadPackageDefinition(packageDefinition).player;

async function GetPlayer(call, callback) {
  try {
    const player = await Player.findById(call.request.id);
    if (player) {
      callback(null, {
        id: player._id.toString(),
        name: player.name,
        position: player.position,
        age: player.age,
        photoUrl: player.photoUrl
      });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Player not found",
      });
    }
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    });
  }
}

async function CreatePlayer(call, callback) {
  try {
    const newPlayer = await Player.create({
      name: call.request.name,
      position: call.request.position,
      age: call.request.age,
      photoUrl: call.request.photoUrl,
    });

    callback(null, {
      id: newPlayer._id.toString(),
      name: newPlayer.name,
      position: newPlayer.position,
      age: newPlayer.age,
      photoUrl: newPlayer.photoUrl

    });
    console.log("✅ Reçu dans CreatePlayer :", call.request);

  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    });
  }
}

module.exports = {
  PlayerService: playerProto.PlayerService.service,
  GetPlayer,
  CreatePlayer,
};
