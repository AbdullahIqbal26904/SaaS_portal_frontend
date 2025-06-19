/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure webpack to solve the issue with react-social-icons bundling its own React
  webpack: (config, { isServer }) => {
    // Resolve React properly to prevent duplicate React versions
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': require.resolve('react'),
      'react-dom': require.resolve('react-dom')
    };
    
    return config;
  }
};

export default nextConfig;
