import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

// Fall back to internal Docker service names if the .env file isn't read
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";
const QUEUE_NAME = process.env.QUEUE_NAME || "moderation_queue";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    console.log(`[RabbitMQ] Connecting to broker at: ${RABBITMQ_URL}`);
    
    // Pass the variable here instead of the hardcoded "amqp://localhost"
    const connection = await amqp.connect(RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME);

    console.log(`🚀 RabbitMQ connected successfully to queue: ${QUEUE_NAME}`);

  } catch (error) {
    console.error("❌ RabbitMQ Connection Error Failure:");
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





















// import amqp from "amqplib";
// import dotenv from "dotenv";
// dotenv.config();

// const QUEUE_NAME = process.env.QUEUE_NAME;

// let channel: amqp.Channel;

// export const connectRabbitMQ = async () => {
//   try {

//     const connection = await amqp.connect(
//       "amqp://localhost"
//     );

//     channel = await connection.createChannel();

//     if (!QUEUE_NAME) {
//       throw new Error("QUEUE_NAME is not defined");
//     }

//     await channel.assertQueue(QUEUE_NAME);

//     console.log("RabbitMQ connected");

//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getChannel = () => {
//   if (!channel) {
//     throw new Error("RabbitMQ channel not initialized");
//   }

//   return channel;
// };

// export { QUEUE_NAME };