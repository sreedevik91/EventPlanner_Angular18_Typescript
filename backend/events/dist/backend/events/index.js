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
const eventRoutes_1 = __importDefault(require("./src/routes/eventRoutes"));
const errorHandler_1 = require("./src/middlewares/errorHandler");
const grpcEventServer_1 = __importDefault(require("./src/grpc/grpcEventServer"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use('/', eventRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const startExpressServer = () => {
    return new Promise((resolve) => {
        app.listen(process.env.PORT || 3003, () => {
            console.log('events server running on port 3003');
        });
        resolve(true);
    });
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    Promise.all([(0, grpcEventServer_1.default)(), startExpressServer()]);
}))();
