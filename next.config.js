/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'oracledb'],
  },
  staticPageGenerationTimeout: 600,
};

module.exports = nextConfig;
