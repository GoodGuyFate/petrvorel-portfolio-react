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

export default async function handler(req, res) {
  const { albumId } = req.query

  if (!albumId) {
    return res.status(400).json({ error: 'albumId is required' })
  }

  const oauth = buildOAuthClient()

  const params = {
    method: 'flickr.photosets.getPhotos',
    photoset_id: albumId,
    user_id: process.env.FLICKR_USER_ID,
    extras: 'url_z,url_c,url_b,url_h,url_k,title,description',
    format: 'json',
    nojsoncallback: '1',
  }

  const baseUrl = 'https://www.flickr.com/services/rest/'
  const queryString = new URLSearchParams(params).toString()
  const url = `${baseUrl}?${queryString}`

  const requestData = { url: baseUrl, method: 'GET', data: params }
  const token = {
    key: process.env.FLICKR_ACCESS_TOKEN,
    secret: process.env.FLICKR_ACCESS_TOKEN_SECRET,
  }

  const authHeader = oauth.toHeader(oauth.authorize(requestData, token))

  try {
    const response = await fetch(url, { headers: { ...authHeader } })
    const data = await response.json()

    if (data.stat === 'fail') {
      console.error('Flickr API error:', data.message)
      return res.status(500).json({ error: data.message })
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    console.error('photos handler error:', error)
    res.status(500).json({ error: 'Failed to fetch photos' })
  }
}