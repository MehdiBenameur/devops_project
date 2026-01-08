const client = require("../grpc/client");
const matchClient = require("../grpc/matchClient");
const scoreClient = require("../grpc/scoreClient");

const resolvers = {
  Query: {
    getPlayer: (_, { id }) =>
      new Promise((resolve, reject) => {
        client.GetPlayer({ id }, (err, player) => {
          if (err) reject(err);
          else resolve(player);
        });
      }),
  getMatch: (_, { id }) =>
      new Promise((resolve, reject) => {
        matchClient.GetMatch({ id }, (err, match) => {
          if (err) reject(err);
          else resolve(match);
        });
      }),
  },
  Mutation: {
    createPlayer: (_, { name, position, age }) =>
      new Promise((resolve, reject) => {
        client.CreatePlayer({ name, position, age }, (err, player) => {
          if (err) reject(err);
          else resolve(player);
        });
      }),
  createMatch: (_, args) =>
      new Promise((resolve, reject) => {
        matchClient.CreateMatch(args, (err, match) => {
          if (err) reject(err);
          else resolve(match);
        });
      }),

    addScore: (_, args) =>
      new Promise((resolve, reject) => {
        scoreClient.AddScore(args, (err, score) => {
          if (err) reject(err);
          else resolve(score);
        });
      }),
  },
};

module.exports = resolvers;
