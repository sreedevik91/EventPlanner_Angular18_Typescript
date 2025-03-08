"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.log('Errors: ', error, error.stack);
    const statusCode = error.status || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json(Object.assign({ success: error.success, message }, (process.env.NODE_ENV === 'development' && { stack: error.stack })));
};
exports.errorHandler = errorHandler;
