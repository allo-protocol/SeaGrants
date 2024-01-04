/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.mikeduran.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/graphql",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://alloscan.spec.dev/graphql",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
