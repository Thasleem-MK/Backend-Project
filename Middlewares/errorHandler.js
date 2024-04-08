const errorHandler = (error, req, res, next) => {
    return res.status(statusCode).send(error.message);
}
module.exports = errorHandler;