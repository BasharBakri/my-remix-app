const axios = require("axios");

export async function fetchCategory(category) {
  const options = {
    method: 'GET',
    url: 'https://bing-news-search1.p.rapidapi.com/news',
    params: {
      count: '10',
      category: category,
      mkt: "en-US",
      safeSearch: 'Off',
      textFormat: 'Raw',
    },
    headers: {
      'X-BingApis-SDK': 'true',
      'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.value;
  } catch (error) {
    console.error(error);
  }
}