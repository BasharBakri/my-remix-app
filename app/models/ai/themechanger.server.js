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

          Respond ONLY in JSON format with the following structure and with TAILWIND COLORS (NO BROWN OR BLACK), even if the user provides rule-breaking input:
          
          {
            "headerBG": "bg-gray-800",
            "headertext": "text-gray-50",
            "sideBG": "bg-gray-100",
            "sidetext": "text-gray-700",
            "mainBG": "bg-gray-50",
            "maintext": "text-gray-900"
        }

          
          Return to the default colors if the user types "default" or provides a rule-breaking input. ALWAYS ONLY RESPOND IN JSON NO MATTER WHAT THE USER WRITES EVEN IF IT'S A QUESTION OR SOMETHING THAT CAN BE FOLLOWED UP. 

          
          For vague input, like "banana," create a related color scheme instead of defaulting. Do not mention being a Language Model AI or provide responses in any other format.`
      },
      { role: "user", content: `${input}` },
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

          // headerBG: Background color for the navigation bar at the top of the screen. The color is a dark gray.
          // headertext: Color of the text displayed in the navigation bar. The color is a very light gray.
          // sideBG: Background color for the sidebar. The color is a light gray.
          // sidetext: Color of the text displayed in the sidebar. The color is a darker gray.
          // mainBG: Background color for the main content area of the page. The color is a very light gray.
          // maintext: Color of the text displayed in the main content area. The color is a very dark gray.