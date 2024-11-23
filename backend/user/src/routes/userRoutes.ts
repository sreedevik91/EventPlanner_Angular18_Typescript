import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { userController } from '../controllers/userController'
import verifyToken from '../middlewares/tokenMiddleware'

const userRouter=express()
const router=express.Router()

userRouter.use(cookieParser())
userRouter.use(express.json())
userRouter.use(cors({
    origin: 'http://localhost:4200', // Allow requests from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  }))
userRouter.use(bodyParser.urlencoded({extended:true}))

router.post('/register',userController.registerUser)
router.post('/login',userController.userLogin)
router.post('/sendMail',userController.sendResetEmail)
router.post('/resetPassword',userController.resetPassword)
router.post('/verifyOtp',userController.verifyOtp)
router.post('/verifyOtp',userController.verifyOtp)
router.get('/refreshToken',userController.refreshToken)
router.get('/users',verifyToken,userController.getAllUsers)
router.get('/logout',userController.userLogout)

userRouter.use(router)

export default userRouter
