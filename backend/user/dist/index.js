"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const grpcUserServer_1 = __importDefault(require("./src/grpc/grpcUserServer"));
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
const logFile_1 = __importDefault(require("./src/utils/logFile"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const db_1 = __importDefault(require("./src/config/db"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
(0, db_1.default)();
// app.use(cookieParser())
// app.use(cors({
//     origin: 'http://localhost:4000', // API Gateway
//     credentials: true,
// }));
app.use(logFile_1.default);
app.use('/', userRoutes_1.default);
// app.use((req, res) => {
//     res.json({ message: '404! Page not found' })
// })
const startExpressServer = () => {
    return new Promise((resolve) => {
        app.listen(process.env.PORT || 3001, () => {
            console.log('user server running on port 3001');
            resolve(true);
        });
    });
};
// app.listen(process.env.PORT || 3001, () => {
//     console.log('user server running on port 3001');
// })
// Start both Express and gRPC servers
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        startExpressServer(),
        (0, grpcUserServer_1.default)(), // gRPC server
    ]);
    console.log('Both servers are up and running!');
}))();
