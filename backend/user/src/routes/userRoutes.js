const express=require('express')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const userController=require('../controllers/userController')
const {verifyToken}=require('../middlewares/middleware')

const userRouter=express()
const router=express.Router()

userRouter.use(cookieParser())
userRouter.use(express.json())
userRouter.use(cors())
userRouter.use(bodyParser.urlencoded({extended:true}))

router.post('/register',userController.registerUser)
router.post('/login',userController.userLogin)
router.post('/sendMail',userController.sendResetEmail)
router.post('/resetPassword',userController.resetPassword)
router.post('/verifyOtp',userController.verifyOtp)
router.get('/sendOtp/:id',userController.resendOtp)
router.get('/logout',userController.userLogout)

userRouter.use(router)

module.exports=userRouter
