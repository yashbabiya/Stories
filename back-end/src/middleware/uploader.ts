import multer from "multer"
import path from "path/posix";
// import path from "path/posix";

const Storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'../uploads'),
    filename:( req, file, cb)=>{
           
        const {originalname} = file;
        
        const usr = req.query.user;
        // console.log("______________________________");
         cb(null,usr+path.extname(file.originalname));
    }
})

export default  multer({ storage:Storage });