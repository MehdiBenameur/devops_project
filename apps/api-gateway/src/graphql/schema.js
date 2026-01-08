const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Player {
    id: ID!
    name: String!
    position: String!
    age: Int!
  }

  type Query {
    getPlayer(id: ID!): Player,
    getMatch(id: ID!): Match
  }

  type Mutation {
    createPlayer(name: String!, position: String!, age: Int!): Player,
    createMatch(
    homeTeam: String!
    awayTeam: String!
    date: String!
    homeTeamLogoUrl: String
    awayTeamLogoUrl: String
    players: [String]
  ): Match,
    addScore(
    matchId: String!
    team: String!
    minute: Int!
    playerId: String
  ): Score
  }

  type Match {
  id: ID!
  homeTeam: String!
  awayTeam: String!
  date: String!
  homeTeamLogoUrl: String
  awayTeamLogoUrl: String
  players: [String]
}

type Score {
  id: ID!
  matchId: String!
  team: String!
  minute: Int!
  playerId: String
}



`;

module.exports = typeDefs;
