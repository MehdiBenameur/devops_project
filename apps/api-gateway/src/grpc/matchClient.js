const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../../proto/match.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const matchProto = grpc.loadPackageDefinition(packageDefinition).match;

const client = new matchProto.MatchService(
  `localhost:${process.env.MATCH_GRPC_PORT}`,
  grpc.credentials.createInsecure()
);

module.exports = client;
