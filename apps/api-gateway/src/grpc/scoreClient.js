const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../../proto/score.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const scoreProto = grpc.loadPackageDefinition(packageDefinition).score;

const client = new scoreProto.ScoreService(
  `localhost:${process.env.SCORE_GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

module.exports = client;
