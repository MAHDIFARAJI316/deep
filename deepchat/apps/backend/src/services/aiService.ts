import OpenAI from 'openai';
import { config } from '@backend/config';
import { IUser } from '@backend/models/User';
import { logger } from 'utils';

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

const isSalesQuestion = (message: string): boolean => {
    const salesKeywords = ['price', 'cost', 'buy', 'purchase', 'discount', 'offer', 'how much'];
    const lowerCaseMessage = message.toLowerCase();
    return salesKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};

const buildPrompt = (user: IUser, messageHistory: string[]): string => {
    const profile = user.aiProfile;
    let prompt = `You are an AI sales assistant for ${profile.onboardingAnswers.get('q1')}. Your business sells ${profile.onboardingAnswers.get('q2')}. `;
    
    // Add other key answers to the context
    prompt += `Business hours are ${profile.onboardingAnswers.get('q3')}. `;
    prompt += `Price range is ${profile.onboardingAnswers.get('q5')}. `;
    prompt += `To buy, ${profile.onboardingAnswers.get('q6')}. `;
    prompt += `The tone you should use is ${profile.onboardingAnswers.get('q18')}. `;
    prompt += `If you cannot answer, ${profile.onboardingAnswers.get('q17')}. `;

    prompt += "\n\nHere is the recent conversation history:\n";
    prompt += messageHistory.join("\n");
    prompt += "\n\nBased on this, provide a helpful and concise response to the last message. If the question is not sales-related or is too complex, respond with 'HANDOVER'.";
    
    return prompt;
};

export const getAIReply = async (user: IUser, messageHistory: string[], lastMessage: string): Promise<string> => {
    if (!user.aiProfile.isTrained) {
        return 'HANDOVER';
    }

    if (!isSalesQuestion(lastMessage)) {
        logger.info(`Message "${lastMessage}" is not a sales question. Handing over to human.`);
        return 'HANDOVER';
    }

    const prompt = buildPrompt(user, messageHistory);

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: prompt }],
            max_tokens: 150,
        });

        const reply = completion.choices[0].message.content?.trim();

        if (!reply || reply.toUpperCase() === 'HANDOVER') {
            return 'HANDOVER';
        }

        return reply;

    } catch (error) {
        logger.error('Error getting AI reply from OpenAI:', error);
        return 'HANDOVER'; // Handover on error
    }
}; 