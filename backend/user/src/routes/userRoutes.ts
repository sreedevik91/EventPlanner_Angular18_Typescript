import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from '../middlewares/passportConfig'
import { userController } from '../controllers/userController'
import verifyToken from '../middlewares/tokenMiddleware'

const userRouter=express()
const router=express.Router()

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

router.get('/auth/google/callback',passport.authenticate('google'), userController.googleLogin)

router.post('/register',userController.registerUser)
router.post('/verifyEmail',userController.verifyEmail)
router.post('/login',userController.userLogin)
router.post('/sendResetEmail',userController.sendResetEmail)
router.post('/resetPassword',userController.resetPassword)
router.post('/verifyOtp',userController.verifyOtp)
router.get('/sendOtp/:id',userController.resendOtp)
router.get('/refreshToken',userController.refreshToken)
router.get('/users',verifyToken,userController.getAllUsers)
router.get('/usersCount',verifyToken,userController.getUsersCount)
router.get('/user/:id',verifyToken,userController.getUser)
router.get('/data',verifyToken,userController.getGoogleUser)
router.post('/edit/:userId',verifyToken,userController.editUser)
router.post('/editStatus',verifyToken,userController.editStatus)
router.get('/logout',userController.userLogout)

userRouter.use(router)

export default userRouter
