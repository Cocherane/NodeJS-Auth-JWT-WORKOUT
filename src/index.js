// ENVIRONMENT VARIABLES CONFIGURATION .env FILE < root location >
require('dotenv').config();

const Server = require('./server/server');


// INSTANCE SERVER INIT
const server = new Server();

// CALL LISTEN ON SERVER
server.listen();

