require('dotenv').config();
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const app = express();
const logger = require('./utils/logger');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const config = require('./utils/config.js');

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI;
logger.info('connecting to', url)

mongoose.connect(url)
  .then(result => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })


app.use(express.static('build'))
app.use(express.json())
app.use(cors())

//API
app.use('/api/notes', notesRouter);

//Error Handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;