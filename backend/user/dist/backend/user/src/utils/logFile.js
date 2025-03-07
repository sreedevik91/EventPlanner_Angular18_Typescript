"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rotating_file_stream_1 = require("rotating-file-stream");
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const logStream = (0, rotating_file_stream_1.createStream)('app.log', {
    interval: '1d',
    path: path_1.default.join(__dirname, '../logs'),
    size: '10M'
});
// to create custom token eg: ':method'
morgan_1.default.token('host', function (req, res) { return req.hostname; });
const logger = (0, morgan_1.default)(':method :url :status [:date[clf]] - :response-time ms :host', { stream: logStream });
// module.exports=logger
exports.default = logger;
