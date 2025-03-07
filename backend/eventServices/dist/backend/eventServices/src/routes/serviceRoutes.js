"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const serviceController_1 = require("../controllers/serviceController");
const serviceRepository_1 = require("../repository/serviceRepository");
const serviceServices_1 = require("../services/serviceServices");
const emailService_1 = require("../services/emailService");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)();
const serviceRoute = (0, express_1.default)();
const serviceRepository = new serviceRepository_1.ServiceRepository();
const emailService = new emailService_1.EmailService();
const serviceServices = new serviceServices_1.ServiceServices(serviceRepository, emailService);
const serviceController = new serviceController_1.ServiceController(serviceServices);
serviceRoute.use((0, cookie_parser_1.default)());
serviceRoute.use(express_1.default.json({ limit: '50mb' }));
// serviceRoute.use('../public', express.static(path.join(__dirname, 'public')));
// serviceRoute.use(express.static(path.join(__dirname, 'public')));
serviceRoute.use('/uploads', express_1.default.static('src/public'));
serviceRoute.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
serviceRoute.use((0, cors_1.default)());
// const Storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         console.log('imagePath from service routes.ts:', path.join(__dirname, '../public'));
//         cb(null,path.join(__dirname,'../public'))
//     },
//     filename:function(req,file,cb){
//         // const name=Date.now()+'_'+file.originalname
//         const name=`${Date.now()}_${file.originalname}`
//         cb(null,name)
//     }
// })
// const upload=multer({storage:Storage})
// router.get('/services/count', serviceController.getTotalServices)
// router.get('/services', serviceController.getAllServices)
// router.get('/name/:name', serviceController.getServiceByName)
// router.get('/:id', serviceController.getServiceById)
// router.post('/new', upload.fields([{ name: 'img' }, { name: 'choiceImg' }]), serviceController.createService)
// // router.get('/editStatus/:id',serviceController.editStatus)
// // router.get('/services/approved', serviceController.getApproved)
// // router.get('/approveService/:id',serviceController.approveService)
// // while using patch method,more specific routes should come before general ones:
// router.patch('/status', serviceController.editStatus)
// router.patch('/approve', serviceController.approveService)
// router.patch('/:id', upload.fields([{ name: 'img' }, { name: 'choiceImg' }]), serviceController.editService)
// router.delete('/:id', serviceController.deleteService)
router.get('/services/count', (req, res) => serviceController.getTotalServices(req, res));
router.get('/services', (req, res) => serviceController.getAllServices(req, res));
router.get('/name/:name', (req, res) => serviceController.getServiceByName(req, res));
router.post('/new', multer_1.upload.fields([{ name: 'img' }, { name: 'choiceImg' }]), (req, res) => serviceController.createService(req, res));
router.patch('/status', (req, res) => serviceController.editStatus(req, res));
router.patch('/approve', (req, res) => serviceController.approveService(req, res));
router.route('/:id')
    .get((req, res) => serviceController.getServiceById(req, res))
    .patch(multer_1.upload.fields([{ name: 'img' }, { name: 'choiceImg' }]), (req, res) => serviceController.editService(req, res))
    .delete((req, res) => serviceController.deleteService(req, res));
serviceRoute.use(router);
exports.default = serviceRoute;
