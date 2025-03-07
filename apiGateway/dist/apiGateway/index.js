"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const logFile_1 = __importDefault(require("./utils/logFile"));
const verifyToken_1 = __importDefault(require("./middlewares/verifyToken"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    // origin: 'http://localhost:4200', // Frontend URL
    origin: 'localhost',
    // origin: '*',
    credentials: true, // Allow cookies to be sent
}));
app.use(logFile_1.default);
const writeStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, './utils/data.log'), { flags: 'a' });
// to create custom token eg: ':method'
morgan_1.default.token('host', function (req, res) { return req.hostname; });
app.use((0, morgan_1.default)(':method :url :status [:date[clf]] - :response-time ms :host', { stream: writeStream }));
// const services = [
//     { path: '/user', target: process.env.USER_SERVICE },
//     { path: '/service', target: process.env.SERVICES_SERVICE },
//     { path: '/event', target: process.env.EVENT_SERVICE },
//     { path: '/booking', target: process.env.BOOKING_SERVICE },
//     { path: '/chat', target: process.env.CHAT_SERVICE },
//     { path: '/', target: process.env.FRONTEND },
// ]
const services = [
    { path: '/api/user', target: process.env.USER_SERVICE },
    { path: '/api/service', target: process.env.SERVICES_SERVICE },
    { path: '/api/event', target: process.env.EVENT_SERVICE },
    { path: '/api/booking', target: process.env.BOOKING_SERVICE },
    { path: '/api/chat', target: process.env.CHAT_SERVICE },
    { path: '/', target: process.env.FRONTEND },
];
// here each object in the service array is destructured to path and target variables so that it could be used directly
const createProxy = ({ path, target }) => {
    // if (!target) return
    // if (path === '/api/chat') {
    //     app.use(path, verifyToken, createProxyMiddleware({
    //         target,
    //         changeOrigin: true,
    //         ws: true, // Enable WebSocket proxying
    //         cookieDomainRewrite: 'localhost'
    //     }))
    // } else {
    //     app.use(path,
    //         path === '/' ?
    //             createProxyMiddleware({
    //                 target,
    //                 changeOrigin: true,
    //                 cookieDomainRewrite: 'localhost'
    //             })
    //             :
    //             verifyToken, createProxyMiddleware({
    //                 target,
    //                 changeOrigin: true,
    //                 cookieDomainRewrite: 'localhost'
    //             })
    //     )
    // }
    if (path === '/') {
        app.use(path, (0, http_proxy_middleware_1.createProxyMiddleware)({
            target,
            changeOrigin: true,
            cookieDomainRewrite: 'localhost'
        }));
    }
    else {
        app.use(path, verifyToken_1.default, (0, http_proxy_middleware_1.createProxyMiddleware)({
            target,
            changeOrigin: true,
            ws: path === '/api/chat' ? true : false,
            cookieDomainRewrite: 'localhost'
        }));
    }
    // app.use(path, verifyToken, createProxyMiddleware(
    //     {
    //         target,
    //         changeOrigin: true,
    //         ws:path==='/chat' ? true : false,
    //         cookieDomainRewrite: 'localhost'
    //     }
    // ))
};
// app.use(express.static(path.join(__dirname, './public')));
// app.use('*', (req:Request,res:Response)=>{
//     res.sendFile(path.join(__dirname,'./public/browser/index.html'))
// })
services.forEach(createProxy);
app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port 4000');
});
