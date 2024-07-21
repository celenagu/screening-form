module.exports = {
    apps: [
      {
        name: 'screening-app-server',
        script: './api/index.js',
        max_restarts: 10, // Maximum restarts before stopping
        min_uptime: '1m', // Minimum uptime before considering a restart
        restart_delay: 5000, // Delay before restarting (in milliseconds)
      }
    ]
  };