import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const QUEUE_NAME = process.env.QUEUE_NAME;

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {

    const connection = await amqp.connect(
      "amqp://localhost"
    );

    channel = await connection.createChannel();

    if (!QUEUE_NAME) {
      throw new Error("QUEUE_NAME is not defined");
    }

    await channel.assertQueue(QUEUE_NAME);

    console.log("RabbitMQ connected");

  } catch (error) {
    console.error(error);
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  return channel;
};

export { QUEUE_NAME };