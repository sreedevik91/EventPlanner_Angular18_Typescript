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
const eventController_1 = require("../controllers/eventController");
const multer_1 = require("../middlewares/multer");
const eventRepository_1 = require("../repository/eventRepository");
const eventServices_1 = require("../services/eventServices");
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
const eventRoute = (0, express_1.default)();
const eventRepository = new eventRepository_1.EventRepository();
const emailService = new emailService_1.EmailService();
const eventService = new eventServices_1.EventServices(eventRepository, emailService);
const eventController = new eventController_1.EventController(eventService);
eventRoute.use((0, cookie_parser_1.default)());
eventRoute.use(express_1.default.json({ limit: '50mb' }));
// eventRoute.use('../public', express.static(path.join(__dirname, 'public')));
// eventRoute.use(express.static(path.join(__dirname, 'public')));
eventRoute.use('/uploads', express_1.default.static('src/public'));
eventRoute.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
eventRoute.use((0, cors_1.default)());
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
// router.get('/events/count',eventController.getTotalEvents)
// router.get('/events',eventController.getAllEvents)
// router.get('/service/:name',eventController.getEventServiceByName)
// router.get('/events/:name',eventController.getEventsByName)
// router.get('/:id',eventController.getEventById)
// router.post('/new',upload.single('img'),eventController.createEvent)
// // while using patch method,more specific routes should come before general ones:
// router.patch('/status',eventController.editStatus)
// // router.patch('/approve',eventController.approveService)
// router.patch('/:id',upload.single('img'),eventController.editEvent)
// router.delete('/:id',eventController.deleteEvent) 
router.get('/events/count', (req, res, next) => eventController.getTotalEvents(req, res, next));
router.get('/events', (req, res, next) => eventController.getAllEvents(req, res, next));
router.get('/service/:name', (req, res, next) => eventController.getEventServiceByName(req, res, next));
router.get('/events/:name', (req, res, next) => eventController.getEventsByName(req, res, next));
router.patch('/status', (req, res, next) => eventController.editStatus(req, res, next));
router.post('/new', multer_1.upload.single('img'), (req, res, next) => eventController.createEvent(req, res, next));
router.route('/:id')
    .get((req, res, next) => eventController.getEventById(req, res, next))
    .patch(multer_1.upload.single('img'), (req, res, next) => eventController.editEvent(req, res, next))
    .delete((req, res, next) => eventController.deleteEvent(req, res, next));
// router.delete('/:id',(req:Request,res:Response,next:NextFunction)=>eventController.deleteEvent(req,res,next)) 
eventRoute.use(router);
exports.default = eventRoute;
