const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../../../player-service/proto/player.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const playerProto = grpc.loadPackageDefinition(packageDefinition).player;

const client = new playerProto.PlayerService(
  `localhost:${process.env.PLAYER_GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

module.exports = client;
