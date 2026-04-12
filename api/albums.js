export default async function handler(req, res) {
  const apiKey = process.env.FLICKR_API_KEY
  const userId = process.env.FLICKR_USER_ID

  try {
    const response = await fetch(
      `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=${userId}&api_key=${apiKey}&format=json&nojsoncallback=1`
    )
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch albums' })
  }
}