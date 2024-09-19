
module.exports = {
  apps: [
    {
      args: ['--color'],
      name: 'typeorm',
      script: 'dist/src/main.js',
      instances: '1',
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        NODE_ENV: 'LOCAL',
      },
    },
  ],
};
