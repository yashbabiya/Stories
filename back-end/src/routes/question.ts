import express from "express";
import multer from "multer";
import path from "path";
import { postQuestion,getAllQuestion, followQuestion, getQuestionById, editQuestion, searchQuestion, saveImagePath, deleteQuestion } from "../controllers/question";
import { autherization } from "../helpers/general";

const router = express();
let img="";
const Storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,__dirname+'../../../public/uploads/questions'),
    filename:( req, file, cb)=>{
           
        const {originalname} = file;
        
        const _id:any = req.query.id || "";
        
        img = _id+path.extname(originalname);
         cb(null,_id+path.extname(originalname));

    }
})
const upload =  multer({ storage:Storage });

router.post('/upload',upload.single("image"),(req,res)=>saveImagePath(req,res,img))
router.post('/post',autherization,postQuestion.validator,postQuestion.controller)
router.get('/all',getAllQuestion.controller)
router.get('/follow',autherization,followQuestion.controller)
router.get('/getQuestion',getQuestionById.validator,getQuestionById.controller)
router.post('/edit',autherization,editQuestion.validator,editQuestion.controller)
router.get('/search',searchQuestion.validator,searchQuestion.controller)
router.get('/delete',deleteQuestion.validator,deleteQuestion.controller)


export default router;