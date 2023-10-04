// Stores SERVER_URL and other configuration variables
let config={}
config.HOST = 'http://localhost:3000'
// http://localhost:3000/api/auth/...nextauth
config.GOOGLE_OAUTH_CALLBACK = 'http://localhost:3000/api/auth'

export default config;