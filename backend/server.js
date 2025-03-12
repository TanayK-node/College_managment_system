const app = require('./app');
const http = require('http');
const { Pool } = require('pg');
const pool = require('./src/config/db');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});