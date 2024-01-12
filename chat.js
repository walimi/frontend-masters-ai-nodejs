import { openai } from './openai.js'

// this will import the readline module that's builtin node, not a third party module named 'readline'
// you can put the node prefix for every internal node module
// readline allows you to see text in our terminal
import readline from 'node:readline' 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const newMessage = async (history, message) => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [...history, message], // history would need to go in the beginning of the array
        model: 'gpt-3.5-turbo',
    })

    return chatCompletion.choices[0].message
}

// if your function is one line of code you don't need to use the return object. 
// by putting the parantheses, you're indicating that you're returning this object.
const formatMessage = (userInput) => ({ role: 'user', content: userInput })

const chat = () => {
    const history = [
        {
            role: 'system',
            content: 'You are an AI assistant. Answer your questions using pirate speak.'
        },
    ]

    const start = () => {
        rl.question('You: ', async (userInput) => {
            if (userInput.toLowerCase() === 'exit') {
                rl.close()
                return
            }

            const message = formatMessage(userInput)
            const response = await newMessage(history, message)

            history.push(message, response)
            console.log(`\n\nAI: ${response.content}\n\n`)
            start()
        })
    }

    start()
    console.log(`\n\nAI: How can I help you today?\n\n`)
}

console.log('Chatbot initialized. Type "exit" to end the chat.')
chat()







