
import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import { getUserDataFromTocken } from "../helpers/getUserDataFromTocken";
import fs from 'fs';
import Auth from "../schemas/auth";
import Que from "../schemas/question";
import Ans from "../schemas/answer";
import path from "path";
import _ from 'lodash';


export const allUsers = {
    controller:async(req:Request,res:Response)=>{
        let users:any = await Auth.find()
        let userData:any = [];

        users.map((usr:any) =>{
            userData = [
                ...userData,
                {
                    "_id" : usr._id,
                    "username" : usr.username
                }
            ]
        })

        return res.send(userData)
    }
}

export const userById = {
    validator:(req:Request,res:Response,next:NextFunction)=>{
        if(!req.query?.id)
        return res.status(400).send("Pass userId in Query")
        next()
    },
    controller:async(req:Request,res:Response)=>{
        const id = req.query.id

        const result:any = await Auth.findById(id).then((data:any)=>data).catch(()=>null)
        let resultQues:any = await Que.find({"user_id":id}).then((data:any)=>data).catch(()=>[])

        

         
        let resultAns:any = await Ans.find({"user_id":id}).then((data:any)=>data).catch(()=>[])
        if(!(result && resultQues && resultAns))
        return res.status(400).send("User not found")


        let allQues:any=[]
        
    //     await result.questions.map(async(q_id:any)=>{
    //        const data = await Que.find({"_id":q_id}).then((data:any)=>data).catch(()=>[])
    //        allQues = [
    //            ...allQues,
    //            data
    //        ]
    //    })


       var results: any = await Promise.all(result.questions.map(async (q_id:any) => {
            const data = await Que.find({"_id":q_id}).then((data:any)=>data).catch(()=>[])
            allQues = [
                ...allQues,
                ...data
            ]
        }));
        

        let userData = {

                    "_id" : result._id,
                    "profile": result.profile,
                    "username" : result.username,
                    "questions" : allQues,
                    "bio_title" : result.btitle,
                    "bio_des" : result.bbio,
                    "askedByMe" : resultQues,
                    "email": result.email,
                    "answers":resultAns
        }
        
        return res.send(userData)
    }
}

export const searchUser = {
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
                {"username": resp},
                {"email": resp}
            ]
        }
        let data = await Auth.find(parameter).then((data:any)=>data).catch(()=>{})
        
        let x:any=[]
        data.map(
            (obj:any)=>{
                 obj.password = undefined
                 obj.bbio = undefined
                 obj.btitle = undefined
                 obj.questions = undefined

                console.log(obj);
                
                x=[...x,obj]
            }
        )
        
        
        
        return res.send(x)
    }
}

export const saveImagePath = async(req:Request,res:Response,fname:string)=>{

        let user:any = await getUserDataFromTocken(req.headers.authorization || "")
       
        console.log("user",user);

        
         await Auth.findByIdAndUpdate(user._id,{"profile":user.username}
        
        ,function (err:Error, docs:Document) {
            if(err)
            return res.status(400)
            return res.send(docs)
        })
        
        return res.send(req.body.image);
}

export const isUserNameAvailable = async(uname:string)=>{
    const result = await Auth.findOne({username:uname})

    console.log("_______________",result==null);
    
    return (result == null)
}

export const editUserDetails = {
    validator:(req:Request,res:Response,next:NextFunction)=>{

        if(!(req.query?.id))
        return res.status(400).send("pass userId in query")

        next();
    },
    controller:async (req:Request,res:Response) => {
        let currUser = await getUserDataFromTocken(req.headers.authorization || "")
        if(currUser == null)
        return res.status(401).send("User not exist")
        
        if(currUser._id != req.query.id)
        return res.status(400).send("Not correct User") 

        const uname = req.body?.username || ""
        

        if(uname!="")
        {
            
            if(!(await isUserNameAvailable(uname))){
            
            return res.status(400).send("Username already exists")
            }

           
            let ext = path.extname(currUser.profile);
            const newProfile = `${uname}`+ext;
            const newProfilePath = `./public/uploads/users/${uname}${ext}`;
            const oldProfilePath = `./public/uploads/users/${currUser.profile}`
            console.log(oldProfilePath,"____________________",newProfilePath);
            
            req.body = {
                ...req.body,
                profile:newProfile
            }
            fs.rename(oldProfilePath, newProfilePath, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
        }

        await Auth.findByIdAndUpdate(currUser._id,req.body,function (err:Error,docs:Document) {
            if(err)
            return res.status(500)
           
            console.log(docs);
            
        })


        return res.send("UserDetails Updated")


    }
}