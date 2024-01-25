import { openai } from './openai.js'

import math from 'advanced-calculator'

const QUESTION = process.argv[2] || 'hi'


const messages = [
    {
        role: 'user',
        content: QUESTION
    }
]

// you can put different functions here. it could be an API call. 
const functions = {
    calculate({ expression }) {        
        return math.evaluate(expression)
    }
}

const getCompletion = (message) => {
    return openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages,
        temperature: 0,
        //function_call: { name: 'calculate'}, // if we had this, GPT would call calculate function no watter what the prompt was.
        functions: [
            {
                name: 'calculate',
                description: 'Run math expressions',
                parameters: {
                    type: 'object',
                    properties: {
                        expression: {
                            type: 'string',
                            description: 'The math expression to evaluate like "2 * 3 + (21/2) ^ 2"'
                        }
                    },
                    required: ['expression']  
                    
                }
            }
        ]
    })
}

let response
while(true) {
    response = await getCompletion(messages)

    // if the GPT finished generating the response w/o running into any token limitations are any 
    // other reason
    if (response.choices[0].finish_reason === 'stop') {
        console.log(response.choices[0].message.content)
        break
    } 
    // else if the finish reason is that GPT needs us ta make a function call
    else if (response.choices[0].finish_reason === 'function_call') {
        const fnName = response.choices[0].message.function_call.name
        const args = response.choices[0].message.function_call.arguments
        
        const funcToCall = functions[fnName]
        const params = JSON.parse(args)

        const result = funcToCall(params)

        messages.push({
            role: 'assistant',
            content: null, 
            function_call: {
                name: fnName,
                arguments: args
            }
        })

        messages.push({
            role: 'function',
            name: fnName,
            content: JSON.stringify({ result })
        })
    }
}