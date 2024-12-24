import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer";
import serviceController from "../controllers/serviceController";
import path from "path";

const router=Router()
const serviceRoute=express()

serviceRoute.use(cookieParser())
serviceRoute.use(express.json({limit:'50mb'}))
// serviceRoute.use('../public', express.static(path.join(__dirname, 'public')));
// serviceRoute.use(express.static(path.join(__dirname, 'public')));
serviceRoute.use('/uploads',express.static('src/public'));
serviceRoute.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
serviceRoute.use(cors())

const Storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log('imagePath from service routes.ts:', path.join(__dirname, '../public'));
    
        cb(null,path.join(__dirname,'../public'))
    },
    filename:function(req,file,cb){
    
        // const name=Date.now()+'_'+file.originalname
        const name=`${Date.now()}_${file.originalname}`
        cb(null,name)
    }
})

const upload=multer({storage:Storage})

router.get('/totalService',serviceController.getTotalServices)
router.get('/services',serviceController.getAllServices)
router.get('/delete/:id',serviceController.deleteService) 
router.get('/service/:id',serviceController.getServiceById)
router.post('/addService',upload.fields([{name:'img'},{name:'choiceImg'}]),serviceController.createService)
// router.post('/addService',upload.single('img'),serviceController.createService)
router.post('/edit/:id',upload.fields([{name:'img'},{name:'choiceImg'}]),serviceController.editService)
router.get('/editStatus/:id',serviceController.editStatus)
router.get('/approveService/:id',serviceController.approveService)
router.get('/getServiceByName/:name',serviceController.getServiceByName)


serviceRoute.use(router)
export default serviceRoute 