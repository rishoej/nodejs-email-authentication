const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const config = require('./config');

// DB setup
mongoose.connect(config.mongoDB);

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));

// Routes
router(app);

// Server setup
const port = process.env.PORT || 3050;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port)
