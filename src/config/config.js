// Stores SERVER_URL and other configuration variables
let config={}
config.HOST = 'http://localhost:3000'
// http://localhost:3000/api/auth/...nextauth
config.GOOGLE_OAUTH_CALLBACK = 'http://localhost:3000/api/auth'

config.AVATAR_FALLBACKS=[
    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
]

config.AVAILABLE_AUTH_PROVIDERS = {
    magic_link:1,
    google:1,
    github:1,
    microsoft:1
}

config.INFINITE_SCROLL_PAGINATION_AMOUNT = 5
config.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif']
config.ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']
config.MAX_IMAGE_SIZE = 1048576 * 5 // 5MB
config.MAX_POST_LENGTH = 5000
config.MAX_COMMENT_LENGTH = 1000
config.MAX_COMMENT_DEPTH = 5
config.VOTE_THRESHOLD = 2
config.NEGATIVE_VOTE_THRESHOLD = -15

export default config;