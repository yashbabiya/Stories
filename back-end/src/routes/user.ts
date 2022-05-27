import express, { NextFunction } from "express";
import multer from "multer";
import path from "path";
import { allUsers, userById,searchUser, saveImagePath, editUserDetails } from "../controllers/user";
import { autherization } from "../helpers/general";
import fs from "fs"
import { getUserDataFromTocken } from "../helpers/getUserDataFromTocken";
import { nextTick } from "process";
// import upload from '../middleware/uploader'
const router = express();


let fname:string = "";
const Storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,__dirname+'../../../public/uploads/users'),
    filename:async( req, file, cb)=>{
           
        const {originalname} = file;
        console.log("___________",originalname);
        
        let user:any = await getUserDataFromTocken(req.headers.authorization || "")
        const usr:any = req.query.user || "";
        fname  = usr+path.extname(originalname)
        let files = fs.readdirSync('public/uploads/users');
        if(files.includes(user.username+'.jpg')){
            fs.unlinkSync('public/uploads/users/'+user.username+'.jpg')

            
            
        }
        
         cb(null,user.username+'.jpg');

    }
})

const upload =  multer({ storage:Storage }).single('image');


router.get('/userById',userById.validator,userById.controller)
router.get('/all',allUsers.controller)
router.get('/search',searchUser.validator,searchUser.controller)
router.post('/upload',autherization,

(req,res,next:NextFunction)=>{
    upload(req,res,(err)=>{
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        next();
    })
}
,(req,res)=>saveImagePath(req,res,fname))
router.patch('/edit',autherization,editUserDetails.validator,editUserDetails.controller)

export default router;