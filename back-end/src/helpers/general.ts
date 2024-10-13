import {  Request, Response, NextFunction, RequestHandler, Router } from "express";
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

export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Automatically passes errors to the next middleware
  };
};

export const wrapAsyncRoutes = (router: Router) => {
  const originalRoute = router.route.bind(router);

  router.route = (...args: Parameters<typeof originalRoute>) => {
    const route = originalRoute(...args);

    // Wrap each route handler in asyncHandler
    route.stack.forEach((layer: any) => {
      if (layer.handle && typeof layer.handle === 'function') {
        layer.handle = asyncHandler(layer.handle);
      }
    });

    return route;
  };
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};