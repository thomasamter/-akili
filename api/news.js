// Vercel Serverless Function - Fetch African News
// Uses NewsAPI.org to get latest African headlines

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate') // Cache for 30 mins

  const apiKey = process.env.NEWSAPI_KEY

  if (!apiKey) {
    // Return fallback news if no API key
    return res.status(200).json({
      articles: [
        {
          title: "Live African News Coming Soon",
          description: "Real-time African news headlines will be available shortly. Stay tuned!",
          url: "https://www.bbc.com/news/world/africa",
          source: { name: "BBC Africa" },
          publishedAt: new Date().toISOString(),
          urlToImage: null
        }
      ]
    })
  }

  try {
    // Fetch African news from NewsAPI
    // Using African news sources
    const domains = 'bbc.co.uk,aljazeera.com,reuters.com'
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=Africa&domains=${domains}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('NewsAPI error:', errorData)
      throw new Error(errorData.message || 'Failed to fetch news')
    }

    const data = await response.json()

    // Format the response
    const articles = data.articles?.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: { name: article.source?.name || 'News' },
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage
    })) || []

    return res.status(200).json({ articles })

  } catch (error) {
    console.error('News API error:', error)

    // Return fallback on error
    return res.status(200).json({
      articles: [
        {
          title: "Explore African Headlines",
          description: "Visit BBC Africa or Al Jazeera for the latest news from across the continent.",
          url: "https://www.bbc.com/news/world/africa",
          source: { name: "BBC Africa" },
          publishedAt: new Date().toISOString(),
          urlToImage: null
        }
      ]
    })
  }
}
