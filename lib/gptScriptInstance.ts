import { GPTScript } from "@gptscript-ai/gptscript";

const g = new GPTScript({
    APIKey: process.env.OPENAI_API_KEY,
    // APIKey: 'sk-proj-2QdSMMmtGknS3dbzUjhFT3BlbkFJ30xLMWaPyMoQIXyp59YU',
});

export default g;