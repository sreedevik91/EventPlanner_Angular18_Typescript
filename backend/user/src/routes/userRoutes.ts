import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import passport from '../middlewares/passportConfig'
import userController from '../controllers/userController'
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
router.post('/email/verify',userController.verifyEmail)
router.post('/login',userController.userLogin)
router.post('/password/resetEmail',userController.sendResetEmail)
router.post('/password/reset',userController.resetPassword)
router.post('/otp/verify',userController.verifyOtp)


// router.post('/verifyUser',userController.verifyUser)
router.patch('/verify',userController.verifyUser)

router.get('/logout',userController.userLogout)
router.get('/data',userController.getGoogleUser)
router.get('/otp/:id',userController.resendOtp)
router.get('/token/refresh',userController.refreshToken)
router.get('/users',userController.getAllUsers)
router.get('/users/count',userController.getUsersCount)

router.get('/:id',userController.getUser)

// router.post('/editStatus',userController.editStatus)
router.patch('/status',userController.editStatus)

// router.post('/edit/:userId',userController.editUser)
router.patch('/:userId',userController.editUser)




userRouter.use(router)

export default userRouter

