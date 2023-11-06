/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize", "oracledb"],
  },
};

module.exports = nextConfig;
