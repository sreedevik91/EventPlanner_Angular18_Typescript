import express, { NextFunction, Request, Response, Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
import { ServiceController } from "../controllers/serviceController";
import path from "path";
import { ServiceRepository } from "../repository/serviceRepository";
import { ServiceServices } from "../services/serviceServices";
import { EmailService } from "../services/emailService";
import { upload } from "../middlewares/multer";

const router = Router()
const serviceRoute = express()

const serviceRepository = new ServiceRepository()
const emailService = new EmailService()
const serviceServices = new ServiceServices(serviceRepository, emailService)
const serviceController = new ServiceController(serviceServices)


serviceRoute.use(cookieParser())
serviceRoute.use(express.json({ limit: '50mb' }))
serviceRoute.use('/uploads', express.static('src/public'));
serviceRoute.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
serviceRoute.use(cors())

router.get('/services/count', (req: Request, res: Response,next:NextFunction)=>serviceController.getTotalServices(req,res,next))
router.get('/services', (req: Request, res: Response,next:NextFunction)=>serviceController.getAllServices(req,res,next))

router.post('/new', upload.fields([{ name: 'img' }, { name: 'choiceImg' }]), (req: Request, res: Response,next:NextFunction)=>serviceController.createService(req,res,next))

router.patch('/status', (req: Request, res: Response,next:NextFunction)=>serviceController.editStatus(req,res,next))
router.patch('/approve', (req: Request, res: Response,next:NextFunction)=>serviceController.approveService(req,res,next))

router.route('/:id')
    .get((req: Request, res: Response,next:NextFunction)=>serviceController.getServiceById(req,res,next))
    .patch( upload.fields([{ name: 'img' }, { name: 'choiceImg' }]), (req: Request, res: Response,next:NextFunction)=>serviceController.editService(req,res,next))
    .delete((req: Request, res: Response,next:NextFunction)=>serviceController.deleteService(req,res,next))
    
router.get('/name/:name', (req: Request, res: Response,next:NextFunction)=>serviceController.getServiceByName(req,res,next))

serviceRoute.use(router)
export default serviceRoute 