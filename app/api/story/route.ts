import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import { headers } from 'next/headers';
import { z } from 'zod';

const api_key = process.env.API_KEY;

const configuration = new Configuration({
    apiKey: api_key,
});

const openai = new OpenAIApi(configuration);

const schema = {
  "type": "object",
  "properties": {
    "suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "property_reference": {
            "type": "string"
          },
          "new_content": {
            "oneOf": [
              {
                "type": "string",
              },
              {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            ]
          },
          "proposed_change_reason": {
            "type": "string"
          },
          "should_be_changed": {
            "type": "boolean"
          },
          "change_importance": {
            "type": "number",
            "maximum": 7,
            "minimum": 1
          },
        },
        "required": [
          "property_reference",
          "change_importance",
          "should_be_changed"
        ]
      }
    }
  },
  "required": [
    "suggestions"
  ]
};

export async function POST(request: NextRequest) {
  const headersList = headers();
  if( headersList.get('Authorization') !== process.env.API_KEY) {
    return NextResponse.json({ success: false });
  }
  
  const response = new Response(request.body);
  const userStory = await response.json();

  const props = Object.keys(userStory).join(", ");

  const gpt35turboResponse = z.object({
    data: z.object({
      choices: z.object({
        message: z.object({
          function_call: z.any(),
        })
      }).array(),
    })
  });

  const chatCompletionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    //model: "gpt-4-0613",
    messages: [
      { "role": "system", "content": "You are an user story checker program." },
      //{ "role": "system", "content": `These are the rules you should follow: ${rules}` },
      {
        "role": "system", "content": [
          'You are given a user story in JSON format.',
          'I want to rewrite the user story to be more understandable and make it follow the rules.',
          'You should generate a list of suggestions for the user story.',
          `"property_reference" should contain one of the properties from the userStory (${props}).`,
          'You can create multiple suggestions for each property of the user story.',
          '"change_importance" value of 7 is very important, while 1 is not important at all.',
          'If you think that creator of user story should be notified about this change, set "should_be_changed" to true.',
          'If you think that creator of user story should not be notified about this change, set "should_be_changed" to false.',
          //'Rewrite the content of given user story property and save it to "proposed_change" if "should_be_changed" is true.',
          'Set "proposed_change_reason" to the reason why you think that this change should be made.',
          'Suggestion with "property_reference" set to "story_description" should follow "As a... I want... So that..." format.',
        ].join(" ")
      },
      // { "role": "system", "content": `You are given a user story in JSON format. property_reference should contain one of the properties from the userStory (${props}). Generate new content in proposed_change.` },
      { "role": "user", "content": `Find errors and give me suggestion for following user story written in json: ${JSON.stringify(userStory, null, 2)}` }
    ],
    functions: [{ "name": "lint_user_story", "parameters": schema }],
    function_call: { "name": "lint_user_story" },
    temperature: 0,
  });

  const chatCompletion = gpt35turboResponse.parse(chatCompletionResponse).data.choices[0]?.message.function_call?.arguments;

  if(!chatCompletion) {
    throw new Error('User story couldn\'t be open-aied.');
  }

  console.log(chatCompletion);

  return NextResponse.json(chatCompletion);
}