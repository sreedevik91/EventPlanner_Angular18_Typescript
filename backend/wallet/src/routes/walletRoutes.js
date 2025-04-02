"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const walletRepository_1 = require("../repository/walletRepository");
const walletServices_1 = require("../services/walletServices");
const emailService_1 = require("../services/emailService");
const walletController_1 = require("../controllers/walletController");
const router = (0, express_1.Router)();
const walletRoute = (0, express_1.default)();
const walletRepository = new walletRepository_1.WalletRepository();
const emailService = new emailService_1.EmailService();
const walletService = new walletServices_1.WalletService(walletRepository, emailService);
const walletController = new walletController_1.WalletController(walletService);
walletRoute.use(express_1.default.json({ limit: '50mb' }));
router.route('/:id')
    .get((req, res, next) => walletController.getWalletById(req, res, next))
    .post((req, res, next) => walletController.createWallet(req, res, next))
    .patch((req, res, next) => walletController.updateWalletById(req, res, next))
    .delete((req, res, next) => walletController.deleteWalletById(req, res, next));
router.get('/userWallet/:userId', (req, res, next) => walletController.getWalletByUserId(req, res, next));
walletRoute.use(router);
exports.default = walletRoute;
