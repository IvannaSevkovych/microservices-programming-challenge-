const express = require("express");
const amqp = require("amqplib");

const PORT = 8093;
const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Application is healthy" });
});

async function consumeMessages() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://rabbit-mq");
    const channel = await connection.createChannel();

    // Declare the queue from which to consume messages
    const queueName = "hello";
    await channel.assertQueue(queueName, { durable: false });

    // Consume messages from the queue
    channel.consume(queueName, (message) => {
      if (message !== null) {
        // Process the received message
        console.log("Received message:", message.content.toString());

        // Acknowledge the message
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Start consuming messages
consumeMessages();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
