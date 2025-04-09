import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from '../middlewares/passportConfig'
import { UserController } from '../controllers/userController'
import { UserServices } from '../services/userServices'
import { UserRepository } from '../repository/userRepository'
import { EmailService } from '../services/emailService'
import { CookieService } from '../services/cookieService'
import { TokenService } from '../services/tokenService'
import { PasswordService } from '../services/passwordService'
import { OtpService } from '../services/otpService'

const userRouter=express()
const router=express.Router()

const userRepository= new UserRepository()
const emailService= new EmailService()
const cookieService= new CookieService()
const tokenService= new TokenService()
const passwordService= new PasswordService()
const otpService= new OtpService(userRepository,emailService)

const userService= new UserServices(userRepository,emailService,cookieService,tokenService,passwordService,otpService)
const userController= new UserController(userService)

userRouter.use(cookieParser())
userRouter.use(express.json())
userRouter.use(session({ secret: process.env.SESSION_SECRET_KEY!, cookie: { maxAge: 600000 }, resave: false, saveUninitialized: false }))
// userRouter.use(cors({
//     origin: 'http://localhost:4200', // Allow requests from this origin
//     credentials: true, // Enable credentials (cookies, authorization headers, etc.)
//   }))
userRouter.use(bodyParser.urlencoded({extended:true}))
userRouter.use(passport.initialize())
userRouter.use(passport.session())

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',passport.authenticate('google'),(req: Request, res: Response,next:NextFunction)=> userController.googleLogin(req,res,next))

router.post('/register',(req: Request, res: Response,next:NextFunction)=>userController.registerUser(req,res,next))
router.post('/email/verify',(req: Request, res: Response,next:NextFunction)=>userController.verifyEmail(req,res,next))
router.post('/login',(req:Request, res:Response,next:NextFunction) => userController.userLogin(req,res,next)) 
router.post('/password/resetEmail',(req: Request, res: Response,next:NextFunction)=>userController.sendResetEmail(req,res,next))
router.post('/password/reset',(req: Request, res: Response,next:NextFunction)=>userController.resetPassword(req,res,next))
router.post('/otp/verify',(req: Request, res: Response,next:NextFunction)=>userController.verifyOtp(req,res,next))

router.patch('/verify',(req: Request, res: Response,next:NextFunction)=>userController.verifyUser(req,res,next))
router.patch('/status',(req: Request, res: Response,next:NextFunction)=>userController.editStatus(req,res,next))
router.patch('/:userId',(req: Request, res: Response,next:NextFunction)=>userController.editUser(req,res,next))

router.get('/logout',(req: Request, res: Response,next:NextFunction)=>userController.userLogout(req,res,next))
router.get('/data',(req: Request, res: Response,next:NextFunction)=>userController.getGoogleUser(req,res,next))
router.get('/otp/:id',(req: Request, res: Response,next:NextFunction)=>userController.resendOtp(req,res,next))
router.get('/token/refresh',(req: Request, res: Response,next:NextFunction)=>userController.refreshToken(req,res,next))
router.get('/users',(req: Request, res: Response,next:NextFunction)=>userController.getAllUsers(req,res,next))
router.get('/users/count',(req: Request, res: Response,next:NextFunction)=>userController.getUsersCount(req,res,next))
router.get('/:id',(req: Request, res: Response,next:NextFunction)=>userController.getUser(req,res,next))

userRouter.use(router)

export default userRouter

