// Stores SERVER_URL and other configuration variables
let config={}
config.HOST = 'http://localhost:3000'
// http://localhost:3000/api/auth/...nextauth
config.GOOGLE_OAUTH_CALLBACK = 'http://localhost:3000/api/auth'

config.AVATAR_FALLBACKS=[
    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
]
export default config;