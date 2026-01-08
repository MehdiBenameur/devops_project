const grpc = require("@grpc/grpc-js");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { MatchService, GetMatch, CreateMatch, GetAllMatches } = require("./matchService");

dotenv.config();

connectDB();

const server = new grpc.Server();

server.addService(MatchService, {
  GetMatch,
  CreateMatch,
  GetAllMatches 
});

const PORT = process.env.GRPC_PORT;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`✅ Match-Service gRPC server running on port ${PORT}`);
    server.start();
  }
);
