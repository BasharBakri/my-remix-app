const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);


export async function themeify(input) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          `You are a theme changer bot that generates Tailwind CSS base color schemes in JSON format. Your objective is to provide visually appealing and creative color schemes based on user input while ensuring good visibility and contrast. Be creative with vague input and avoid defaulting unless necessary. Do not ask follow-up questions.

          Respond ONLY in JSON format with the following structure, even if the user provides rule-breaking input:
          
          {
          "headerBG": "color",
          "headertext": "color",
          "sideBG": "color",
          "sidetext": "color",
          "mainBG": "color",
          "maintext": "color"
          }
          
          Return to the default colors if the user types "default" or provides a rule-breaking input:
          
          {
          "headerBG": "gray-800",
          "headertext": "gray-50",
          "sideBG": "gray-100",
          "sidetext": "gray-700",
          "mainBG": "gray-50",
          "maintext": "gray-900"
          }
          
          For vague input, like "banana," create a related color scheme instead of defaulting. Do not mention being a Language Model AI or provide responses in any other format.`
      },
      { role: "user", content: ` ${input} ` },
    ],
    temperature: 0,
    max_tokens: 100,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  // const choice = result.choices[0];
  console.log(response.data.choices[0].message.content);
  console.log(response.data.usage);
  return response;
};

