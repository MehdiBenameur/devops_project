const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "score-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "score-group" });

const run = async () => {
  await consumer.connect();
  console.log("✅ Consumer connecté à Kafka");

  await consumer.subscribe({ topic: "score-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📢 New Event [${topic}] : ${message.value.toString()}`);
    },
  });
};

run().catch(console.error);
