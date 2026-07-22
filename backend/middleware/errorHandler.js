const errorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongoose CastError (Invalid ObjectId)
    if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = `Invalid ${err.path}`;
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err.statusCode = 400;
        err.message = `${field} already exists`;
    }

    // Validation Error
    if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");
    }

    // JWT Invalid
    if (err.name === "JsonWebTokenError") {
        err.statusCode = 401;
        err.message = "Invalid Token";
    }

    // JWT Expired
    if (err.name === "TokenExpiredError") {
        err.statusCode = 401;
        err.message = "Token Expired";
    }

    console.error(err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

// module.exports = errorHandler;

export default errorHandler;