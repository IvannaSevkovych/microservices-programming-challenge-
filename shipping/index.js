const amqp = require("amqplib");

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
