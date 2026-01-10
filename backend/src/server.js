const app = require('./app');
const config = require('./config/env');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
    🚀 Server is running!
    📡 Port: ${PORT}
    🌍 Environment: ${config.nodeEnv}
    📍 URL: http://localhost:${PORT}
    🏥 Health: http://localhost:${PORT}/api/health
  `);
});