/** @type {import('next').NextConfig} */
const nextConfig = {}

 nextConfig.images={
    domains: [
      'uploadthing.com', 'lh3.googleusercontent.com','universe-aws-bucket.s3.ap-south-1.amazonaws.com', "unsplash.com",
      "picsum.photos","placehold.co","utfs.io"
  ],
  dangerouslyAllowSVG: true,
    
  }

module.exports = nextConfig
