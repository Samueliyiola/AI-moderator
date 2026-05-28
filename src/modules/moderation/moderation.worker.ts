import { prisma } from "../../core/config/db";

import { getChannel, QUEUE_NAME } from "../../core/config/rabbitmq";

import { geminiModel } from "../../core/config/gemini";

const moderateText = async (text: string) => {

    const prompt = `
    You are a strict AI content moderation system.

    Analyze the following text and determine whether it contains:
    - hate speech
    - violence
    - harassment
    - self-harm
    - sexual/offensive content

    Return ONLY valid JSON in this exact format:

    {
    "flagged": boolean,
    "reason": "string"
    }

    Text:
    """${text}"""
    `;

    const result = await geminiModel.generateContent(prompt);

    const response = await result.response.text();

    // Clean Gemini markdown formatting if present
    const cleanedResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanedResponse);
};

export const startModerationWorker = async () => {

    const channel = getChannel();

    console.log("Moderation worker started");

    if (!QUEUE_NAME) {
        throw new Error("Queue name is not defined.");
    }

    channel.consume( QUEUE_NAME, async (message) => {

        if (!message) return;

        try {

            const { contentId, text } = JSON.parse(
            message.content.toString()
            );

            console.log("Moderating:", text);

            // AI moderation
            const moderation = await moderateText(
            text
            );

            const status = moderation.flagged
            ? "REJECTED"
            : "APPROVED";

            // Update database
            await prisma.content.update({
            where: {
                id: contentId,
            },
            data: {
                status,
            },
            });

            console.log(
            `Content ${contentId} → ${status}`
            );

            // Acknowledge successful processing
            channel.ack(message);

        } catch (error) {

            console.error(
            "Moderation worker error:",
            error
            );

        }
        }
    );
};







// import { getChannel, QUEUE_NAME } from "../../core/config/rabbitmq";
// import { geminiModel } from "../../core/config/gemini";


// const moderateText = async (text: string) => {
//         const prompt = `
//         You are a strict content moderation system.

//         Analyze the text and return ONLY valid JSON.

//         Rules:
//         - Flag content that contains hate, violence, sexual content, self-harm, harassment.

//         Return format:
//         {
//         "flagged": boolean,
//         "reason": string
//         }

//         Text: """${text}"""
//         `;

//         const result = await geminiModel.generateContent(prompt);

//         const response = await result.response.text();

//         return JSON.parse(response);
// };


// export const startModerationWorker = async () => {

//     const channel = getChannel();

//     console.log("Moderation worker started");
//     if(!QUEUE_NAME){
//         throw new Error("Queue name is not defined.")
//     }

//     channel.consume( QUEUE_NAME, async (message) => {

//         if (!message) return;

//         const parsedMessage = JSON.parse(message.content.toString());

//         console.log( "Received message:", parsedMessage);

//         // Acknowledge message
//         channel.ack(message);
//     }
//     );

// };


