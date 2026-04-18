import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: __dirname,
    },

    images: {
        remotePatterns: [
            {
                hostname: "ik.imagekit.io",
                protocol: "https",
            }
        ]
    }
}

export default nextConfig
