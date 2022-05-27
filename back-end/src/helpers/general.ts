import {  Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtKey } from "../config";

export const autherization = (req:Request,res:Response,next:any) =>{
  try{
    let key:string = process.env.PRIVATRE_KEY || ""
   const payload  = jwt.verify(req.headers.authorization || "",key)
 
   
   
  }
  catch(e){
    if (e instanceof jwt.JsonWebTokenError){
        return res.status(401).end();
    }
    return res.status(400).end()
  }
  next();
}