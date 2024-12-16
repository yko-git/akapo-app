/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.akapo-app.com", "s3.us-east-2.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.akapo-app.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
