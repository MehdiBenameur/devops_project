const grpc = require("@grpc/grpc-js");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const {
  PlayerService,
  GetPlayer,
  CreatePlayer,
} = require("./playerService");

dotenv.config();

// Connect to MongoDB
connectDB();

const server = new grpc.Server();

server.addService(PlayerService, {
  GetPlayer,
  CreatePlayer,
});

const PORT = process.env.GRPC_PORT;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`gRPC server running at 0.0.0.0:${port}`);
    //server.start();
  }
);
