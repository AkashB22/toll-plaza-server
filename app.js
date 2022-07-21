const http = require('http');
const lodash = require('lodash');
const mongoose = require('mongoose');
const express = require('./express');
const logger = require('./services/logger.service').getLogger();
const server = http.createServer(express);
const {
  MONGO_CONNECTION_URL = 'mongodb://localhost:27017/toll-plaza',
  PORT = 3000
} = process.env;
mongoose.connect(MONGO_CONNECTION_URL)
  .then(() => logger.info('mongodb connection succesful'))
  .catch((err) => console.error(err));

// start server and listens on port no
server.listen(PORT, (error) => {
  if (!lodash.isEmpty(error)) {
    // log error whenever node server emits error
    logger.error(error);
  } else {
    // log info whenever node server starts successful
    logger.info('Node Server is started and Listening on port ' + PORT + '...');
  }
});

// log error whenever node server fails to start
server.on('error', (error) => {
  if (!lodash.isEmpty(error)) {
    logger.error(error);
  }
});

server.timeout = 120000;

process.on('uncaughtException', (error) => {
  logger.error(error);
});