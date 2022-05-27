import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import Ans from "../schemas/answer";
import { jwtKey } from "../config";
import Auth from "../schemas/auth";
import { parse } from "path/posix";
import { nextTick } from "process";
import { getUserDataFromTocken } from "../helpers/getUserDataFromTocken";
import { AnyMxRecord } from "dns";
import Que from "../schemas/question";


export const putAnswer = {
    validator:(req:Request,res:Response,next:NextFunction)=>{
        if(!(req.body?.title && req.body?.des && req.body.que_id ))
        return res.status(400).end();

        next();
    },
    controller:async(req:Request,res:Response)=>{
        const userData:any = await getUserDataFromTocken(req.headers.authorization || "")
        
        if(!userData)
        return res.send(406)

        const title = req.body.title;
        const des = req.body.des;
        const que_id = req.body.que_id;
        const user_id = userData._id;
        const username = userData.username;

        new Ans({
            title,
            des,
            que_id,
            user_id,
            username,
            upvote:[],
            downvote:[],
            dateTime:new Date()
        }).save().then(async(data)=>{
            await Que.findByIdAndUpdate(que_id,{$push: {answers:data._id}})
            return  res.send("Answer is Posted");
        }).catch(()=>{
            return  res.status(504).send("Answer is not posted");
        })

    }
}

export const ansToQuestion = async(req:Request,res:Response) =>{
    const q_id = req.query.id;
    const answers:any = await Ans.find({'que_id' : q_id}).sort({_id:-1})
    return res.send(answers)
}


export const vote = {
    validator:(req:Request,res:Response,next:NextFunction)=>{
        if(!(req.query?.id))
        return res.status(400)
        next()
    },
    controller:{
        upvote:async(req:Request,res:Response)=>{
            
            let ansId  =  req.query.id;
            const ans:any = await Ans.findById(ansId)
            const userData:any = await getUserDataFromTocken(req.headers.authorization || "")
            if(!ans)
            return res.send(400)
            
            let upvote = ans?.upvote || []
            let downvote = ans?.downvote || []

            let iu = upvote.indexOf( userData._id)
            let idd = downvote.indexOf( userData._id)

            if(idd>-1)
            {
                return res.status(400).send("cant do upvote if you downvoted");
            }

            if(iu>-1){
                upvote.splice(iu,1);
            }

            else
            {
                    upvote = [
                    ...upvote,
                    userData._id
                ]
            }
            let result = await Ans.findByIdAndUpdate(ansId,{upvote},function (err, docs) {
                if(err)
                return res.status(500)
            }
            )

            return res.send((iu>-1)? "Removed from Upvoted ": "upvoted")


        },downvote:async(req:Request,res:Response)=>{

            let ansId  =  req.query.id;
            const ans:any = await Ans.findById(ansId)
            const userData:any = await getUserDataFromTocken(req.headers.authorization || "")
            if(!ans)
            return res.send(400)
            let downvote = ans?.downvote || []
            let upvote = ans?.upvote || []


            let idd = upvote.indexOf( userData._id)
            let iu = downvote.indexOf( userData._id)
            if(idd>-1)
            {
                return res.status(400).send("cant do downvote if you upvoted");
            }
            if(iu>-1){
                downvote.splice(iu,1);
            }
            else{
                downvote = [
                    ...downvote,
                    userData._id
                ]
            }

        
            let result = await Ans.findByIdAndUpdate(ansId,{downvote},function (err, docs) {
                if(err)
                return res.status(500)
            }
            )

            return res.send((iu>-1) ? "Remove from Downvote" : "downvoted")

        }
    }
}


