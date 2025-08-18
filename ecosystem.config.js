module.exports = {
  apps: [{
    name: 'ai-agent-platform',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/mpai.openpenpal.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/www/server/nodejs/vhost/logs/ai-agent-platform-error.log',
    out_file: '/www/server/nodejs/vhost/logs/ai-agent-platform-out.log',
    log_file: '/www/server/nodejs/vhost/logs/ai-agent-platform.log',
    time: true
  }]
}