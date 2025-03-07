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
const db_1 = __importDefault(require("./src/config/db"));
const serviceRoutes_1 = __importDefault(require("./src/routes/serviceRoutes"));
const grpcServiceServer_1 = __importDefault(require("./src/grpc/grpcServiceServer"));
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
const app = (0, express_1.default)();
(0, dotenv_1.config)();
(0, db_1.default)();
// app.use(cookieParser())
// app.use(cors({
//     origin: 'http://localhost:4000', // API Gateway
//     credentials: true,
// }));
// app.use(express.static(path.join(__dirname, './src/public')));
// console.log('imagePath from service index.ts:', path.join(__dirname, './src/public'));
// app.use(express.static('public'));
app.use('/', serviceRoutes_1.default);
const startExpressServer = () => {
    return new Promise(resolve => {
        app.listen(process.env.PORT || 3002, () => {
            console.log('service server running on port 3002');
        });
        resolve(true);
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([(0, grpcServiceServer_1.default)(), startExpressServer()]);
    console.log('Both servers are up and running!');
}))();
