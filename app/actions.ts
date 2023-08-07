"use server";
import { Configuration, OpenAIApi } from 'openai';
import { z } from 'zod';

const api_key = process.env.API_KEY;

const configuration = new Configuration({
    apiKey: api_key,
});

const openai = new OpenAIApi(configuration);

const storyExample = `### Story Title: Online Shopping Cart
### Story Description:
As a customer, I want to add products to my shopping cart so that I can easily keep track of my selected items.

### Acceptance Criteria:
- The user should be able to view the product details and click an 'Add to Cart' button.
- Once added, the product should appear in the shopping cart with the correct quantity and price.

### User Persona(s):
- Alex
  - An online-savvy customer who frequently shops for various products.
  - Wants a convenient way to organize selected items for purchase.
- Sarah
  - A busy individual who wants to browse products and return later to complete the purchase.
  - Desires a seamless process to add and review products in the cart.

### Value to Users/Stakeholders:
Implementing this user story will improve the shopping experience for customers like Alex and Sarah. It will lead to increased customer satisfaction, higher chances of completing purchases, and ultimately boost revenue for the online store.

### Story Size: Small

### Dependencies: The product catalog and inventory systems must be in place.

### Non-Functional Requirements:
- The shopping cart interface should be responsive and work well on both desktop and mobile devices.

### Notes:
This user story is a basic building block for the online shopping platform. Further enhancements may include the ability to edit quantities, remove items, and apply discounts.`

const storyExampleJSON = `{
  "story_title": "Online Shopping Cart",
  "story_description": "As a customer, I want to add products to my shopping cart so that I can easily keep track of my selected items.",
  "acceptance_criteria": [
    "The user should be able to view the product details and click an 'Add to Cart' button.",
    "Once added, the product should appear in the shopping cart with the correct quantity and price."
  ],
  "user_personas": [
    {
      "name": "Alex",
      "description": "An onlinesavvy customer who frequently shops for various products.",
      "characteristics_goals": "Wants a convenient way to organize selected items for purchase."
    },
    {
      "name": "Sarah",
      "description": "A busy individual who wants to browse products and return later to complete the purchase.",
      "characteristics_goals": "Desires a seamless process to add and review products in the cart."
    }
  ],
  "value_to_users_stakeholders": "Implementing this user story will improve the shopping experience for customers like Alex and Sarah. It will lead to increased customer satisfaction, higher chances of completing purchases, and ultimately boost revenue for the online store.",
  "story_size": "Small",
  "dependencies": "The product catalog and inventory systems must be in place.",
  "non_functional_requirements": [
    "The shopping cart interface should be responsive and work well on both desktop and mobile devices."
  ],
  "notes": "This user story is a basic building block for the online shopping platform. Further enhancements may include the ability to edit quantities, remove items, and apply discounts."
}`;

const userStoryJSONSchema = {
  "type": "object",
  "properties": {
    "story_title": {
      "type": "string",
    },
    "story_description": {
      "type": "string",
    },
    "acceptance_criteria": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "user_personas": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "characteristics_goals": {
          "type": "string"
        },
      }
    },
    "value_to_users_stakeholders": {
      "type": "string",
    },
    "story_size": {
      "type": "string",
    },
    "dependencies": {
      "type": "string",
    },
    "non_functional_requirements": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "notes": {
      "type": "string",
    },
  },
  "required": [
    "suggestions"
  ]
}

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
          "title": {
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
          "title",
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

export async function setData(data: FormData) {
  const story = data.get("story");

  console.log("User Story text: ", story);

  const gpt35turboResponse = z.object({
    data: z.object({
      choices: z.object({
        message: z.object({
          function_call: z.any(),
        })
      }).array(),
    })
  });

  const chatCompletionResponseTextToJSON = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    //model: "gpt-4-0613",
    messages: [
      { "role": "system", "content": "You are an user story text to JSON converter program." },
      {
        "role": "system", "content": [
          'You are given a user story in text format.',
          'You will convert the text of user story to JSON format.',
          `This is an example of user story text: "${storyExample}" and this is JSON output example ${storyExampleJSON}`,
        ].join(" ")
      },
      { "role": "user", "content": `Convert following user story text to JSON: ${story}` }
    ],
    functions: [{ "name": "convert_user_story", "parameters": userStoryJSONSchema }],
    function_call: { "name": "convert_user_story" },
    temperature: 0,
  });

  const userStory = gpt35turboResponse.parse(chatCompletionResponseTextToJSON).data.choices[0]?.message.function_call?.arguments;

  console.log('User story JSON:', userStory);

  const props = Object.keys(JSON.parse(storyExampleJSON)).join(", ");

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
      { "role": "user", "content": `Find errors and give me suggestion for following user story written in json: ${userStory}` }
    ],
    functions: [{ "name": "lint_user_story", "parameters": schema }],
    function_call: { "name": "lint_user_story" },
    temperature: 0,
  });

  const chatCompletion = gpt35turboResponse.parse(chatCompletionResponse).data.choices[0]?.message.function_call?.arguments;

  console.log("OpenAI response: ", chatCompletion);

  if(!chatCompletion) {
    throw new Error('User story couldn\'t be open-aied.');
  }

  return chatCompletion;
}
