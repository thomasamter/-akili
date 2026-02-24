// Vercel Serverless Function - Fetch African News
// Uses NewsAPI.org to get latest African headlines

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate') // Cache for 30 mins

  const apiKey = process.env.NEWSAPI_KEY

  if (!apiKey) {
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
    // African countries and keywords for better filtering
    const africanQuery = '(Nigeria OR Kenya OR Ghana OR "South Africa" OR Ethiopia OR Egypt OR Morocco OR Tanzania OR Uganda OR Rwanda OR Senegal OR "Ivory Coast" OR Cameroon OR Zimbabwe OR Zambia OR Botswana OR Namibia OR Mozambique OR Angola OR "Democratic Republic of Congo" OR Sudan OR Tunisia OR Algeria OR Libya)'

    // Fetch from major news sources covering Africa
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(africanQuery)}&sortBy=publishedAt&pageSize=15&language=en&apiKey=${apiKey}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('NewsAPI error:', errorData)
      throw new Error(errorData.message || 'Failed to fetch news')
    }

    const data = await response.json()

    // Filter to ensure articles are actually about Africa
    const africanKeywords = [
      'nigeria', 'kenya', 'ghana', 'south africa', 'ethiopia', 'egypt',
      'morocco', 'tanzania', 'uganda', 'rwanda', 'senegal', 'ivory coast',
      'cameroon', 'zimbabwe', 'zambia', 'botswana', 'namibia', 'mozambique',
      'angola', 'congo', 'sudan', 'tunisia', 'algeria', 'libya', 'african',
      'africa', 'nairobi', 'lagos', 'accra', 'johannesburg', 'cairo',
      'addis ababa', 'kigali', 'dakar', 'abuja', 'cape town', 'casablanca'
    ]

    const filteredArticles = data.articles?.filter(article => {
      const text = `${article.title} ${article.description}`.toLowerCase()
      return africanKeywords.some(keyword => text.includes(keyword))
    }) || []

    // Format the response
    const articles = filteredArticles.slice(0, 10).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: { name: article.source?.name || 'News' },
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage
    }))

    return res.status(200).json({ articles })

  } catch (error) {
    console.error('News API error:', error)

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
