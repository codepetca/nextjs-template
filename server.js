import Fastify from 'fastify';
import cors from '@fastify/cors';
import OpenAI from 'openai';

const fastify = Fastify({ logger: true });
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

fastify.register(cors, {
    origin: true
});

fastify.post('/grade', async (request, reply) => {
    const { code, prompt } = request.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a code grading assistant. Analyze the code and provide a score (0-100) and detailed feedback."
                },
                {
                    role: "user",
                    content: `Question: ${prompt}\n\nStudent's code:\n${code}\n\nPlease provide a score and feedback.`
                }
            ],
            temperature: 0.7,
        });

        const feedback = response.choices[0].message.content;
        return { feedback };
    } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Failed to grade code' });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3001 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start(); 