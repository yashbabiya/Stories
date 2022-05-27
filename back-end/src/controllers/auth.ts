import { Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import Auth from "../schemas/auth";

import { Algo, jwtKey } from "../config";
import { validateEmail } from "../helpers/validateEmail";


const signup = {
  validator: (req: Request, res: Response, next: any) => {
    
    
    if (!(req.body?.user && req.body?.password && req.body?.email))
     return res.status(402).end();
    if(!validateEmail(req.body.email))
      return res.status(400).end();
    next();
  },
  controller: async(req: Request, res: Response,cb:any) => {
    
    
    const username = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    const btitle = req.body.btitle || "";
    const bbio = req.body.bbio || "";
    const questions:any = [];
    const profile =""

    let xuser;
     xuser =  await Auth.findOne({username:username})
     if(xuser){
         return res.status(400).end();
     }
    
    xuser = await Auth.findOne({email:email})

    if(xuser){
       
      return res.status(400).end();
     
  }
    
    
    
 
    const user = new Auth({
      username,
      password,
      email,
      btitle,
      bbio,
      questions,
      profile
    });
    user
      .save()
      .then(() => {
       return res.status(200).send("User Created");
      })
      .catch(() => {
       return res.status(504).send("User not created");
      });
    }



  
  
};

const login = {
  validator: (req: Request, res: Response, next: any) => {
    if (!(req.body?.user && req.body?.password))
     return res.status(400).end();
    next();
  },
  controller: (req: Request, res: Response) => {
    const username = req.body.user;
    const password = req.body.password;
    const user = { username, password };
    const key:string =  process.env.PRIVATRE_KEY ||""
    Auth.findOne(user)
      .then((data: any) => {

        const token = jwt.sign({
            username: data.username,
            email: data.email,
          }, key, {
            algorithm: Algo,
        })
        const userData=({
          ...data._doc,
          token
        })
       return res.status(200).send(userData);
      })
      .catch(() => {
       return res.status(401).send("User Not Found");
      });
  },
};

export { signup, login };
