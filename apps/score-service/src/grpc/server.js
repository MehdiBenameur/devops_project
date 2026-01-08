const grpc = require("@grpc/grpc-js");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { ScoreService, AddScore, GetAllScores } = require("./scoreService");

dotenv.config();

connectDB();

const server = new grpc.Server();

server.addService(ScoreService, {
  AddScore,
  GetAllScores
});

const PORT = process.env.GRPC_PORT;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`✅ Score-Service gRPC server running on port ${PORT}`);
    server.start();
  }
);
