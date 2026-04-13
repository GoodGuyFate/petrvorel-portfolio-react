export default async function handler(req, res) {
  const apiKey = process.env.FLICKR_API_KEY
  const userId = process.env.FLICKR_USER_ID

  try {
    // fetch collections tree and full photoset list in parallel
    const [collectionsRes, photosetsRes] = await Promise.all([
      fetch(`https://www.flickr.com/services/rest/?method=flickr.collections.getTree&user_id=${userId}&api_key=${apiKey}&format=json&nojsoncallback=1`),
      fetch(`https://www.flickr.com/services/rest/?method=flickr.photosets.getList&user_id=${userId}&api_key=${apiKey}&format=json&nojsoncallback=1`)
    ])

    const collectionsData = await collectionsRes.json()
    const photosetsData = await photosetsRes.json()

    // build a lookup map of albumId -> cover photo data
    const photosetMap = {}
    photosetsData.photosets.photoset.forEach(ps => {
      photosetMap[ps.id] = {
        farm: ps.farm,
        server: ps.server,
        primary: ps.primary,
        secret: ps.secret,
        count_photos: ps.count_photos
      }
    })

    // merge cover data into collections
    const collections = collectionsData.collections.collection.map(collection => ({
      ...collection,
      set: collection.set.map(album => ({
        ...album,
        cover: photosetMap[album.id] || null
      }))
    }))

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json({ collections })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' })
  }
}