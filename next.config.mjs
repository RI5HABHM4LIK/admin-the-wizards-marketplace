/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        //destination: "http://localhost:5000/api/:path*",
        destination:
          "https://backend-the-wizards-marketplace-984409444985.europe-west1.run.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
