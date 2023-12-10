const logger = require('./logger')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    //can be made into an object if gets bigger
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' });
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
          error: 'token expired'
        })
      }

    next(error);
}

const middleware = {
    unknownEndpoint,
    errorHandler,
}

module.exports = middleware;