const errorHandler = (error, req, res, next) => {
    let statusCode=500;
    if (error instanceof notFoundError) {
        statusCode=404;
    }else if(error instanceof BadRequestError)
    {
        statusCode=400;
    }
    return res.status(statusCode).send(error.message);
}
module.exports = errorHandler;