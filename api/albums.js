import crypto from 'crypto'
import OAuth from 'oauth-1.0a'

function buildOAuthClient() {
  return new OAuth({
    consumer: {
      key: process.env.FLICKR_API_KEY,
      secret: process.env.FLICKR_API_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64')
    },
  })
}

async function flickrGet(oauth, token, methodName, extraParams = {}) {
  const baseUrl = 'https://www.flickr.com/services/rest/'
  const params = {
    method: methodName,
    format: 'json',
    nojsoncallback: '1',
    ...extraParams,
  }
  const queryString = new URLSearchParams(params).toString()
  const url = `${baseUrl}?${queryString}`
  const requestData = { url: baseUrl, method: 'GET', data: params }
  const authHeader = oauth.toHeader(oauth.authorize(requestData, token))
  const res = await fetch(url, { headers: { ...authHeader } })
  return res.json()
}

export default async function handler(req, res) {
  const userId = process.env.FLICKR_USER_ID
  const oauth = buildOAuthClient()
  const token = {
    key: process.env.FLICKR_ACCESS_TOKEN,
    secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
  }

  try {
    const [collectionsData, photosetsData] = await Promise.all([
      flickrGet(oauth, token, 'flickr.collections.getTree', { user_id: userId }),
      flickrGet(oauth, token, 'flickr.photosets.getList', { user_id: userId }),
    ])

    if (collectionsData.stat === 'fail') {
      return res.status(500).json({ error: collectionsData.message })
    }

    // Build lookup: albumId -> cover photo metadata
    const photosetMap = {}
    photosetsData.photosets.photoset.forEach(ps => {
      photosetMap[ps.id] = {
        farm: ps.farm,
        server: ps.server,
        primary: ps.primary,
        secret: ps.secret,
        count_photos: ps.count_photos,
      }
    })

    // Merge cover data into collection tree
    const collections = collectionsData.collections.collection.map(collection => ({
      ...collection,
      set: collection.set.map(album => ({
        ...album,
        cover: photosetMap[album.id] || null,
      })),
    }))

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json({ collections })
  } catch (error) {
    console.error('albums handler error:', error)
    res.status(500).json({ error: 'Failed to fetch collections' })
  }
}