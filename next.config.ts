import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // O singura adresa canonica: https://constelatii.com (fara www).
  // www.constelatii.com -> 308 pe aceeasi cale + query. Se potriveste doar
  // host-ul exact, deci localhost si health check-urile nu sunt atinse.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.constelatii.com" }],
        destination: "https://constelatii.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
