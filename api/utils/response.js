export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};

export const responseHandler = (res, statusCode, message, data) => {
    res.status(statusCode).json({ success: true, message, data });
};