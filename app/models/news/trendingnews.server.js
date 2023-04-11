export async function getTrendingNews() {
  console.log('Trending news function');

  const countryCodes = [
    'en-CA', // Canada English
    'fr-CA', // Canada French
    'de-DE', // Germany German
    'fr-FR', // France French
    'zh-CN', // People's Republic of China Chinese
    'en-GB', // United Kingdom English
    'en-US'  // United States English
  ];

  const subscriptionKey = process.env.BING_API_KEY;
  const host = "api.bing.microsoft.com";
  const path = "/v7.0/news/trendingtopics";
  const count = 10;
  // const freshness = "Month";
  // const sortBy = "relevance";
  const offset = 0;
  const mkt = countryCodes[countryCodes.length - 1];

  const url = `https://${host}${path}?count=${count}&mkt=${mkt}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    console.log('Trending result value', result.totalEstimatedMatches);
    return result.value;
  } catch (error) {
    console.log('error', error);
  }
};


