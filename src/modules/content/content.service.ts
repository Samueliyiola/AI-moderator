import { get } from "node:http";
import { prisma } from "../../core/config/db";
import { getChannel, QUEUE_NAME } from "../../core/config/rabbitmq";

export const createContentService = async (text: string) => {
  const content = await prisma.content.create({
    data: {
      text,
      status: "PENDING",
    },
  });

  const channel = getChannel();

  if (!QUEUE_NAME) {
    throw new Error("QUEUE_NAME is not defined");
  }

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ contentId: content.id, text: content.text })));

  return content;
};