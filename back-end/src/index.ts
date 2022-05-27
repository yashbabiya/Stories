import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose"
import auth from './routes/auth'
import question from './routes/question'
import user from './routes/user'
import answer from './routes/answer'
import dotenv from 'dotenv'
import { Mongoose } from "mongoose";
import bodyParser from "body-parser";
const app = express();


app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 


dotenv.config({path:process.cwd()+'/src/.env'}) 

// word

app.use('/auth',auth)
app.use('/question',question)
app.use('/answer',answer)
app.use('/user',user)

app.get('/',(req,res)=>{

    return res.render('index')
})


mongoose.connect(
    process.env.DB_CONN || ""
)
.then((res)=>{
    console.log("connected to database")
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running at ${process.env.PORT}`);
       
    })
    
}).catch((err)=>{
    console.log("nooooo");
    
})
