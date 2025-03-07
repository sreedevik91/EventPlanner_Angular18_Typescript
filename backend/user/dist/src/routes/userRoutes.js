"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passportConfig_1 = __importDefault(require("../middlewares/passportConfig"));
// import userController from '../controllers/userController'
// import verifyToken from '../middlewares/tokenMiddleware'
const userController_1 = require("../controllers/userController");
const userServices_1 = require("../services/userServices");
const userRepository_1 = require("../repository/userRepository");
const emailService_1 = require("../services/emailService");
const cookieService_1 = require("../services/cookieService");
const tokenService_1 = require("../services/tokenService");
const passwordService_1 = require("../services/passwordService");
const otpService_1 = require("../services/otpService");
const userRouter = (0, express_1.default)();
const router = express_1.default.Router();
const userRepository = new userRepository_1.UserRepository();
const emailService = new emailService_1.EmailService();
const cookieService = new cookieService_1.CookieService();
const tokenService = new tokenService_1.TokenService();
const passwordService = new passwordService_1.PasswordService();
const otpService = new otpService_1.OtpService(userRepository, emailService);
const userService = new userServices_1.UserServices(userRepository, emailService, cookieService, tokenService, passwordService, otpService);
const userController = new userController_1.UserController(userService);
userRouter.use((0, cookie_parser_1.default)());
userRouter.use(express_1.default.json());
userRouter.use((0, express_session_1.default)({ secret: process.env.SESSION_SECRET_KEY, cookie: { maxAge: 600000 }, resave: false, saveUninitialized: false }));
userRouter.use((0, cors_1.default)({
    origin: 'http://localhost:4200', // Allow requests from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));
userRouter.use(body_parser_1.default.urlencoded({ extended: true }));
userRouter.use(passportConfig_1.default.initialize());
userRouter.use(passportConfig_1.default.session());
router.get('/auth/google', passportConfig_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/auth/google/callback',passport.authenticate('google'), userController.googleLogin)
router.get('/auth/google/callback', passportConfig_1.default.authenticate('google'), (req, res) => userController.googleLogin(req, res));
// router.post('/register',userController.registerUser)
// router.post('/email/verify',userController.verifyEmail)
// router.post('/login',userController.userLogin)
// router.post('/password/resetEmail',userController.sendResetEmail)
// router.post('/password/reset',userController.resetPassword)
// router.post('/otp/verify',userController.verifyOtp)
// router.patch('/verify',userController.verifyUser)
// router.get('/logout',userController.userLogout)
// router.get('/data',userController.getGoogleUser)
// router.get('/otp/:id',userController.resendOtp)
// router.get('/token/refresh',userController.refreshToken)
// router.get('/users',userController.getAllUsers)
// router.get('/users/count',userController.getUsersCount)
// router.get('/:id',userController.getUser)
// // router.post('/editStatus',userController.editStatus)
// router.patch('/status',userController.editStatus)
// // router.post('/edit/:userId',userController.editUser)
// router.patch('/:userId',userController.editUser)
router.post('/register', (req, res) => userController.registerUser(req, res));
router.post('/email/verify', (req, res) => userController.verifyEmail(req, res));
router.post('/login', (req, res) => userController.userLogin(req, res));
router.post('/password/resetEmail', (req, res) => userController.sendResetEmail(req, res));
router.post('/password/reset', (req, res) => userController.resetPassword(req, res));
router.post('/otp/verify', (req, res) => userController.verifyOtp(req, res));
router.patch('/verify', (req, res) => userController.verifyUser(req, res));
router.patch('/status', (req, res) => userController.editStatus(req, res));
router.patch('/:userId', (req, res) => userController.editUser(req, res));
router.get('/logout', (req, res) => userController.userLogout(req, res));
router.get('/data', (req, res) => userController.getGoogleUser(req, res));
router.get('/otp/:id', (req, res) => userController.resendOtp(req, res));
router.get('/token/refresh', (req, res) => userController.refreshToken(req, res));
router.get('/users', (req, res) => userController.getAllUsers(req, res));
router.get('/users/count', (req, res) => userController.getUsersCount(req, res));
router.get('/:id', (req, res) => userController.getUser(req, res));
userRouter.use(router);
exports.default = userRouter;
