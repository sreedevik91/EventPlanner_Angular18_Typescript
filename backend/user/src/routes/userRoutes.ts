import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from '../middlewares/passportConfig'
// import userController from '../controllers/userController'
// import verifyToken from '../middlewares/tokenMiddleware'
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
userRouter.use(cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  }))
userRouter.use(bodyParser.urlencoded({extended:true}))
userRouter.use(passport.initialize())
userRouter.use(passport.session())

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback',passport.authenticate('google'), userController.googleLogin)

router.get('/auth/google/callback',passport.authenticate('google'),(req:Request,res:Response)=> userController.googleLogin(req,res))


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

router.post('/register',(req:Request,res:Response)=>userController.registerUser(req, res))
router.post('/email/verify',(req:Request,res:Response)=>userController.verifyEmail(req, res))
router.post('/login',(req:Request, res:Response) => userController.userLogin(req, res)) 
router.post('/password/resetEmail',(req:Request,res:Response)=>userController.sendResetEmail(req, res))
router.post('/password/reset',(req:Request,res:Response)=>userController.resetPassword(req, res))
router.post('/otp/verify',(req:Request,res:Response)=>userController.verifyOtp(req, res))

router.patch('/verify',(req:Request,res:Response)=>userController.verifyUser(req, res))
router.patch('/status',(req:Request,res:Response)=>userController.editStatus(req, res))
router.patch('/:userId',(req:Request,res:Response)=>userController.editUser(req, res))

router.get('/logout',(req:Request,res:Response)=>userController.userLogout(req, res))
router.get('/data',(req:Request,res:Response)=>userController.getGoogleUser(req, res))
router.get('/otp/:id',(req:Request,res:Response)=>userController.resendOtp(req, res))
router.get('/token/refresh',(req:Request,res:Response)=>userController.refreshToken(req, res))
router.get('/users',(req:Request,res:Response)=>userController.getAllUsers(req, res))
router.get('/users/count',(req:Request,res:Response)=>userController.getUsersCount(req, res))
router.get('/:id',(req:Request,res:Response)=>userController.getUser(req, res))


userRouter.use(router)

export default userRouter

