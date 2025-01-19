/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/streams/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*'
          },
          {
            key: 'Content-Type',
            value: 'application/vnd.apple.mpegurl'
          }
        ],
      },
      {
        source: '/streams/:cameraId/segment:number.ts',
        headers: [
          {
            key: 'Content-Type',
            value: 'video/mp2t'
          }
        ],
      }
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m3u8$/,
      type: 'asset/resource'
    });
    return config;
  }
}

module.exports = nextConfig
