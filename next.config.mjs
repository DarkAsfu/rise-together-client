/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "www.turagwaterfrontresort.com",
        },
        {
          protocol: "http",
          hostname: "127.0.0.1",
          port: "8000", // Specify the port as well
        },
        {
          protocol: "http",
          hostname: "localhost", // Specify the port as well
          port: "8000", // Specify the port as well
        },
      ],
    },
  };
  
  export default nextConfig;