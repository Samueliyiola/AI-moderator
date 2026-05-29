import { prisma } from "../../core/config/db";
import { Decision, Status } from "@prisma/client";
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
    console.log("Raw moderation response:", response);

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

            const { contentId, text } = JSON.parse( message.content.toString() );

            console.log("Moderating:", text);

            // AI moderation
            const moderation = await moderateText(text);

            const status = moderation.flagged ? Status.REJECTED : Status.APPROVED;

            // Update database
            await prisma.content.update({
            where: {
                id: contentId,
            },
            data: {
                status,
                reason: moderation.reason,
                confidence: moderation.confidence
            },
            });

            await prisma.moderationResult.create({
            data: {
                contentId,

                violenceScore: moderation.violenceScore,

                hateScore: moderation.hateScore,

                sexualScore: moderation.sexualScore,

                spamScore: moderation.spamScore,

                decision: moderation.flagged ? Decision.REJECTED : Decision.APPROVED,
                },
            });

            console.log( `Content ${contentId} → ${status}`);

            // Acknowledge successful processing
            channel.ack(message);

        } catch (error: any) {
            if(error.status == 429 || error.status == 503){
                console.warn("Google API is busy:", error.message);
                channel.nack(message, false, true); // Requeue message
            }
            else{
                console.log("Error processing moderation message:", error);
                channel.nack(message, false, false); // Reject message
            }

            // console.error( "Moderation worker error:", error);

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


