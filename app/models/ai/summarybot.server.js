const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


export async function summarizeSearch(results) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "=== INSTRUCTIONS ===\nYou are an AI language model assisting a user to summarize their search results from Bing News search. Your task is to read the given search result aticles and descriptions into a a very specific and very precise summary for the user. It is crucial that you provide ONLY the summary as the output, without any additional text, quotations, or declarations. The output will be sent directly to the user and cannot be checked beforehand.\n\nKeep in mind that the search is only from  recent months, so avoid mentioning dates. Focus on a global audience, avoiding  or location-centric summaries unless necessary. DO NOT ADD ANY EXTRA QUOTATIONS WHATSOEVER IN YOUR RESPONSE.",
      },
      { role: "user", content: `Summarize these article's names and descriptions  from Bing News search for the user Be concise and and short!: \n ${results}` },
    ],
    temperature: 0.2,
    max_tokens: 150,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // const choice = result.choices[0];
  console.log(response.data);
  return response;
};




