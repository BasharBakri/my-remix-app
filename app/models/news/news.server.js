export async function bingNewsSearch(search) {
  console.log('Searching news for: ' + search);

  const subscriptionKey = process.env.BING_API_KEY;
  const host = "api.bing.microsoft.com";
  const path = "/v7.0/news/search";
  const count = 30;
  const freshness = "Month";
  const sortBy = "relevance";
  const offset = 8;
  const mkt = "en-WW";

  const url = `https://${host}${path}?q=${encodeURIComponent(search)}&count=${count}&freshness=${freshness}&sortBy=${sortBy}&offset=${offset}&mkt=${mkt}`;

  const requestOptions = {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    console.log('Estimated results newsserver 25', result.totalEstimatedMatches);
    return result.value;
  } catch (error) {
    console.log('error', error);
  }
};
