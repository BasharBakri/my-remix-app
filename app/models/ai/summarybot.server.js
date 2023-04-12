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
          // `=== INSTRUCTIONS ===\nYou are an AI language model assisting a user to find an summarize  search results from Bing News search for the user. Your task is to read the given search as well as the result names and descriptions and create an answer for the user, if you cannot find an answer summarize only instead. It is crucial that you provide ONLY the summary or answer as the output, without any additional quotations, or declarations. The output will be sent directly to the user and cannot be checked beforehand.\n\nKeep in mind that the search is only from  recent months, so avoid mentioning dates. Focus on a global audience, avoiding national  or location-centric summaries or answers unless necessary. DO NOT ADD ANY EXTRA QUOTATIONS WHATSOEVER IN YOUR RESPONSE. ` 
          `Summarize the news search results from a Bing news search API to the user You will recieve. Be direct and percise as your info will be shown directly to the user.
          the search results likes so {name: 'name of article', description: 'description of article ${results}'}`
      },
      { role: "user", content: `  User searched: ${search} \n ` },
    ],
    temperature: 0.2,
    max_tokens: 100,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // const choice = result.choices[0];
  console.log('summary response ', response.data.choices);
  return response;
};




