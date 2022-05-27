import { BSONType } from "mongodb";
import mongoose from "mongoose";

const schema = mongoose.Schema;

const questionSchema:any = new schema({
    title:{
        type:String,
        required:true
    },

    des:{
        type:String,
        required:true
    },

    image:{
        type:String
    },

    answers:{
        type:BSONType
    },


    user_id:{
        type:String,
        required:true
    },

    user:{
        type:String
    },

    profile:{
        typr:String
    },

    followers:{
        type: BSONType
    },

    dateTime:{
        type:Date
    }


})

const Que = mongoose.model('Question',questionSchema);
export default Que;