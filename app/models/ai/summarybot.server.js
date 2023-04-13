const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


export async function summarizeSearch(search, results) {
  console.log('check results', results);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          `Summarize the news search results from a Bing news search API to the user. Do not add any extra declerations, quotations or inefficient information. You will recieve the search term, article titles and descriptions do your best. Be direct and percise as your info will be shown directly to the user. Make sure You answer in one paragraph or 4 bullet points in total!
          the search results likes so {name: 'name of article', description: 'description of article ${results}'}`
      },
      { role: "user", content: `  User searched: ${search} \n ` },
    ],
    temperature: 0.2,
    max_tokens: 200,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // const choice = result.choices[0];
  return response;
};




