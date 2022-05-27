import { jwtKey } from "../config";
import jwt from "jsonwebtoken";
import Auth from "../schemas/auth";
import { resolve } from "path/posix";
import { Response } from "express";

export const getUserDataFromTocken = async(token:string)=>{
    let key =  process.env.PRIVATRE_KEY || ""
    const payload:any  = jwt.verify(token,key)
        
        
    const user = payload.username;
    const xx = await Auth.findOne({username:user},(err:Error)=>{
        
    }).then((data:any)=>{
        
        return data
    }).catch(()=>{
        return null
    })

    return xx;
}