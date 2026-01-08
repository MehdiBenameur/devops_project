const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server-express");
const client = require("prom-client");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const playerRoutes = require("./routes/playerRoutes");
const matchRoutes = require("./routes/matchRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   PROMETHEUS METRICS
=========================== */

// Registry Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Counter HTTP requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestsTotal);

// Middleware to count requests
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

/* ===========================
   REST ROUTES
=========================== */

app.use("/api", playerRoutes);
app.use("/api", matchRoutes);
app.use("/api", scoreRoutes);

/* ===========================
   HEALTH CHECK
=========================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "API Gateway",
    timestamp: new Date().toISOString(),
  });
});

/* ===========================
   GRAPHQL
=========================== */

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 REST API running on http://localhost:${PORT}/api`);
    console.log(`🚀 GraphQL running on http://localhost:${PORT}/graphql`);
    console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
  });
}

startApolloServer();
