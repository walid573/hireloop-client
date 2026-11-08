import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Keep the native MongoDB driver out of the bundler (it uses Node internals
  // like `dns`/`net` and breaks when bundled by Turbopack/webpack)
  serverExternalPackages: ["mongodb", "@better-auth/mongo-adapter"],
}

export default nextConfig
