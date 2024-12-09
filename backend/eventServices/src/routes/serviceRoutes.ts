import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import serviceController from "../controllers/serviceController";

const router=Router()
const serviceRoute=express()

serviceRoute.use(cookieParser())
serviceRoute.use(express.json())
serviceRoute.use(bodyParser.urlencoded({extended:true}))
serviceRoute.use(cors())

router.get('/totalService',serviceController.getTotalServices)
router.get('/services',serviceController.getAllServices)
router.get('/delete/:id',serviceController.deleteService) 
router.get('/service/:id',serviceController.getServiceById)
router.post('/addService',serviceController.createService)
router.post('/edit/:id',serviceController.editService)
router.get('/editStatus/:id',serviceController.editStatus)
router.get('/approveService/:id',serviceController.approveService)


serviceRoute.use(router)
export default serviceRoute 