import { NextFunction, Request, response, Response } from "express";
import Que from "../schemas/question";
import { getUserDataFromTocken } from "../helpers/getUserDataFromTocken";
import Auth from "../schemas/auth";
import { ObjectId } from "bson";
import { CallbackError, Document } from "mongoose";
import { nextTick } from "process";
import { IntegerType } from "mongodb";





export const postQuestion ={
    validator: (req: Request, res: Response, next: any) => {
        console.log(req.body)
        if (!(req.body?.title && req.body?.des))
         return res.status(400).end();
        next();
    },
    controller: async(req:Request,res:Response)=>{

        const xuser:any = await getUserDataFromTocken( req.headers.authorization ||  "")
        if(!xuser)
        return res.send(406)
       

        const title = req.body.title;
        const des = req.body.des;
        const user_id:string = xuser._id;

        
        
        const question = new Que({
           title,
           des,
           user_id:xuser._id,
           user:xuser.username,
           profile:xuser.profile,
           followers:[],
           dateTime:new Date()
        });

        question.save().then((data) => {
            return res.status(200).send(data);
           })
           .catch(() => {
            return res.status(504).send("Question not posted");
           });
        

    }

}

export const getAllQuestion = {
    controller: async(req:Request,res:Response)=>{

        const page:any = req.query.page;
        const item = 10;
        console.log(page);
        
        const data:any = await Que.find().sort({_id:-1}).catch(()=>null);
        
        let r=null;
        if(page > data.length/item + 1)
        {
            return res.send([])
        }
        if(page)
        {
            const ei = page*item;
            const si = (page-1)*item;
            
            r=data?.slice(si,ei);
            console.log(r);
        }
        else{
            r=data
        }
        
        return res.send(r)

    }
}

export const followQuestion = {
    controller: async(req:Request,res:Response)=>{
        const id:any = req.query.id;
        const userData:any = await getUserDataFromTocken(req.headers.authorization ||"");
        if(!userData)
        return res.send(406)
        // console.log(userData);
        
        
        let q_id:any = new ObjectId(id)
        const data:any = await Que.findById(q_id);
        
        
        
        let followers:any = data?.followers || [];

        const User:any = await Auth.findById(userData._id);

        let questions = User?.questions || [];

            const index = followers.indexOf(userData._id);
            const indexForQ = questions.indexOf(id);
        

        let h=false;
        let t=false;
        followers.map((f:any)=>{
            if(String(f)==String(userData._id))
            {
                h=true;
                
            }
        })
        
        
        if ( h ) {
            followers.splice(index, 1);
            questions.splice(indexForQ,1);
        }
        else
        {
            
            followers = [
                ...followers,
                userData._id
            ]
           
            questions = [
                ...questions,
                q_id
            ]
        }

        
        // console.log(followers);
        // console.log(questions);
        await Que.findByIdAndUpdate(q_id,{"followers":followers},function (err:CallbackError) {
            if(err)
            return res.status(500)
        })
        
        await Auth.findByIdAndUpdate(userData._id,{"questions":questions},function (err:CallbackError) {
            if(err)
            return res.status(500)
        })

       

        return res.status(200).send( h ? "Unfollow" : "Follow") 
    }
}

export const getQuestionById = {
    validator:(req:Request,res:Response,next:NextFunction)=>{
        if(!req.query?.id)
        return res.send(400)
        next()
    },
    controller:async(req:Request,res:Response)=>{
        let que_id = req.query.id
        let question = await Que.findById(que_id,function (err:CallbackError) {
            if(err)
            return res.status(500)
        })

        return res.send(question)
    }
}

export const editQuestion = {
    validator:(req:Request,res:Response,next:NextFunction)=>{
        if(!(req.query?.id &&req.body?.title && req.body?.des))
        return res.status(400).send("Pass id in query")
        next()
    },
    controller:async(req:Request,res:Response)=>{
        let currUser = await getUserDataFromTocken(req.headers.authorization || "")
        const que_id = req.query.id
        
        const question:any = await Que.findById(que_id)
                                    .then((data)=> data)
                                    .catch(()=> null)
        
        if(!question)
        return res.status(400).send("Question not found")

        let queUser:any = question.user_id


        queUser = String(queUser)
        let currUserId = String(currUser._id)

       
        
        
        if(currUserId != queUser)
        return res.status(400).send("Not correct User")

        const title = req.body.title
        const des = req.body.des
        const date = new Date()

        let result = await Que.findByIdAndUpdate(que_id,{title,des,dateTime:date},function (err, docs) {
            if(err)
            return res.status(500)
        }
        )

        return res.send("Question updated")


    }
}

export const deleteQuestion = {
    validator:(req:Request,res:Response,next:NextFunction)=>{
        if(!(req.query?.id))
        return res.status(400).send("Pass id in query")
        next()
    },
    controller:async(req:Request,res:Response)=>{
        let currUser = await getUserDataFromTocken(req.headers.authorization || "")
        const que_id = req.query.id
        
        const question:any = await Que.findById(que_id)
                                    .then((data)=> data)
                                    .catch(()=> null)
        
        if(!question)
        return res.status(400).send("Question not found")

        let queUser:any = question.user_id


        queUser = String(queUser)
        let currUserId = String(currUser._id)

       
        
        
        if(currUserId != queUser)
        return res.status(400).send("Not correct User")

        

         Que.findByIdAndDelete(que_id).then(()=>{

             return res.send("Question deleted")
         }).catch(()=>{
            return res.status(400).send("Question not deleted")

         })



    }
}

export const searchQuestion = {
    validator: (req:Request,res:Response,next:NextFunction)=>{
        if(!(req.query?.keyword))
        return res.status(400).send("Pass keyword in query")

        next()
    },

    controller: async (req:Request,res:Response)=>{
        const keys:any = req.query.keyword

        if(keys==='')
        return res.status(400)
        
        let resp = new RegExp(keys,'i')
        let parameter : any ={
            $or: [
                {"title": resp},
                {"des": resp}
            ]
        }
        let data = await Que.find(parameter).then((data:any)=>data).catch(()=>{})
        console.log(data);
        return res.send(data)
    }
}

export const saveImagePath = async(req:Request,res:Response,img:string)=>{

    let que_id:any = req.query.id;
    return await Que.findByIdAndUpdate(que_id,{"image":img},(err:any, docs:any) => {
        if(err)
        return res.status(400)
        return res.send(docs)
    })
    
}