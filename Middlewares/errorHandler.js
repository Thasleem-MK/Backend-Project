const errorHandler = (error, req, res, next) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ Error: error.message });
    };

    if (error.name === 'CastError') {
        return res.status(400).json({ Error: 'Invalid product ID format' });
    }

    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ Error: 'Unauthorized: Your token has expired. Login again..' })
    }
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ Error: 'Unauthorized: Invalid token..' })
    }
    if (error.code === 11000) {
        const keyName = Object.keys(error.keyValue)[0];
        return res.json({ Error: `Given ${keyName} is already exist` })
    }
    return res.status(500).send(error);
}
module.exports = errorHandler;