import 'dotenv/config'

import OpenAI from 'openai'

const openai = new OpenAI()

const results = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        {
            role: 'assistant',
            content: 'You are an AI assistant, answer any questions to the best of your ability.'
        },
        {
            role: 'user',
            content: 'Create a numbered list of movies that featured Amitabh Bachan in chronological order.'
        }  
    ]
})

console.log(results.choices[0].message.content)