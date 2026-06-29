/* eslint-disable no-undef */
export default {
  port: process.env.PORT || 1701,
  bible: {
    apiKey: process.env.BIBLE_API_KEY,
    apiUrl: process.env.BIBLE_API_URL,
    bibleId: process.env.BIBLE_ID,
  },
  auth: {
    // HS256 secret used to sign our own app JWTs
    jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-change-me',
    jwtExpiry: process.env.JWT_EXPIRY || '90d',
    apple: {
      // Comma-separated allowed audiences (app bundle id and/or services id)
      clientIds: (process.env.APPLE_CLIENT_IDS || '').split(',').filter(Boolean),
    },
    google: {
      // Comma-separated allowed audiences (web + ios client ids)
      clientIds: (process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || '').split(',').filter(Boolean),
    },
  },
}
