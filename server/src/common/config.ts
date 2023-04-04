export default {
  port: process.env.PORT || 1701,
  bible: {
    apiKey: process.env.BIBLE_API_KEY,
    apiUrl: process.env.BIBLE_API_URL,
    bibleId: process.env.BIBLE_ID,
  },
}
