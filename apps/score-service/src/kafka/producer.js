const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "score-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const sendEvent = async (eventType, data) => {
  await producer.connect();
  await producer.send({
    topic: "score-events",
    messages: [
      {
        value: JSON.stringify({ eventType, data }),
      },
    ],
  });
  await producer.disconnect();
};

module.exports = sendEvent;
