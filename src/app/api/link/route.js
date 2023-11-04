import { logger } from "@/lib/logger"
import axios from "axios"

export async function GET(req) {
    // Gets preview of a URL
    try {
        const url = new URL(req.url)
        const href = url.searchParams.get('url')

        if (!href) {
            return new Response('Invalid href', { status: 400 })
        }

        const res = await axios.get(href)
        const titleMatch = res.data.match(/<title>(.*?)<\title>/)
        const title = titleMatch ? titleMatch[1] : ''

        const descriptionMatch = res.data.match(/<meta name="description" content="(.*?)">/)
        const description = descriptionMatch ? descriptionMatch[1] : ''

        // Get favicon
        const imageMatch = res.data.match(/meta property="og:image" content="(.*?)"/)
        const imageUrl = imageMatch ? imageMatch[1] : ''

        // As per Editor.js docss
        return new Response(JSON.stringify({
            success: 1,
            meta:{
                title,
                description,
                image: {
                    url: imageUrl
                }
            }
        }))

    } catch (err) {
        logger.error(err)
        return new Response(JSON.stringify({ success: 0, error: err.message }), { status: 500 })
    }

}