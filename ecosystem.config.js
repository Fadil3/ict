module.exports = {
  apps: [
    {
      name: 'ict',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      },
    },
  ],
}
