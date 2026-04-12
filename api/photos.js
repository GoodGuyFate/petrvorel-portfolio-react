export default async function handler(req, res) {
  const apiKey = process.env.FLICKR_API_KEY
  const userId = process.env.FLICKR_USER_ID
  const { albumId } = req.query

  if (!albumId) {
    return res.status(400).json({ error: 'albumId is required' })
  }

  try {
    const response = await fetch(
      `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=${albumId}&user_id=${userId}&api_key=${apiKey}&extras=url_b,title,description&format=json&nojsoncallback=1`
    )
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' })
  }
}