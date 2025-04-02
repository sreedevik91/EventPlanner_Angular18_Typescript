import express, { Router,Request,Response, NextFunction } from "express";
import { WalletRepository } from "../repository/walletRepository";
import { WalletService } from "../services/walletServices";
import { EmailService } from "../services/emailService";
import { WalletController } from "../controllers/walletController";

const router=Router()
const walletRoute=express()

const walletRepository=new WalletRepository()
const emailService=new EmailService()
const walletService=new WalletService(walletRepository,emailService)
const walletController= new WalletController(walletService)

walletRoute.use(express.json({limit:'50mb'}))

router.route('/:id')
.get((req:Request,res:Response,next:NextFunction)=>walletController.getWalletById(req,res,next))
.post((req:Request,res:Response,next:NextFunction)=>walletController.createWallet(req,res,next))
.patch((req:Request,res:Response,next:NextFunction)=>walletController.updateWalletById(req,res,next))
.delete((req:Request,res:Response,next:NextFunction)=>walletController.deleteWalletById(req,res,next))

router.get('/userWallet/:userId',(req:Request,res:Response,next:NextFunction)=>walletController.getWalletByUserId(req,res,next))

walletRoute.use(router)

export default walletRoute 