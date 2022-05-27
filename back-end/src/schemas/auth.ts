import { BSONType } from "mongodb";
import mongoose, { Model, Schema } from "mongoose";
import { ConstructorTypeNode, ModuleKind } from "typescript";


interface auth{
    username:string,
    password:string,
    profile:string,
    email:string,
    btitle:string,
    bbio:string,
    questions:any
}
const schema:any = mongoose.Schema;

const authSchema:any = new schema({
    username:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    profile:{
        type:String
    },

    email:{
        type:String,
        required:true
    },

    btitle:{
        type:String,
    },

    bbio:{
        type:String,
    },

    questions:{
        type:BSONType
    }

})

const Auth:any = mongoose.model('Authentication',authSchema);
export default Auth;