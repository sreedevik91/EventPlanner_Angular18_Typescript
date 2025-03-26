import multer from "multer";
import path from "path";

const Storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log('imagePath from service routes.ts:', path.join(__dirname, '../public'));
    
        cb(null,path.join(__dirname,'../public'))
    },
    filename:function(req,file,cb){
    
        const name=`${Date.now()}_${file.originalname}`
        cb(null,name)
    }
})

export const upload=multer({storage:Storage})