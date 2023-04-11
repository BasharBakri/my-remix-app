const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


export async function refineSearchTerm(search) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "=== INSTRUCTIONS ===\nYou are an AI language model assisting a user to refine their search term for Bing News API. Your task is to modify the given search term into a more specific and very precise query for better search results. It is crucial that you provide ONLY the revised search term as the output, without any additional text, quotations, or declarations. The output will be sent directly to the search API and cannot be checked beforehand.\n\nKeep in mind that the API can only access news articles from the recent months, so there's no need to mention any specific date. Focus on recent and global events, avoiding outdated or location-specific results unless necessary. DO NOT ADD ANY EXTRA QUOTATIONS WHATSOEVER IN YOUR RESPONSE. \n\nExample 1:\nInput: \"Electric cars\"\nOutput: \"Latest advancements and trends in electric vehicle technology",
      },
      { role: "user", content: `Refine this search term for Bing News API: ${search}` },
    ],
    temperature: 0,
    max_tokens: 70,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // const choice = result.choices[0];
  console.log(response.data);
  return response;
}




