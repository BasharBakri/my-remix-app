const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


export async function summarizeSearch(search, results) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          `=== INSTRUCTIONS ===\n
          Read the articles provided through the Bing news search API results. Attempt to answer the user's query using the information from the articles, if possible. In many cases, a direct answer may not be feasible, so just provide a summary. Use only the search term, article titles, and descriptions provided, and rely primarily on the article data. Avoid unnecessary declarations, quotations, or extraneous information. Be concise and accurate, as your response will be displayed directly to the user. Limit your answer to one paragraph or a total of four bullet points. Do not mention your role as a chatbot in the response. keep in mind we are in April 2023. \n The articles: ${results}'}`
      },
      { role: "user", content: `  User searched: ${search} \n ` },
    ],
    temperature: 0.2,
    max_tokens: 200,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const content = response.data.choices[0].message.content;

  // Return only the content
  return content;
};




