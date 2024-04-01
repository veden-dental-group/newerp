/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'oracledb'],
  },
  serverRuntimeConfig: {
    apiTimeout: 300000,
  },
  staticPageGenerationTimeout: 300,
};

module.exports = nextConfig;
