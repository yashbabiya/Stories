import { Int32 } from "bson";
import mongoose from "mongoose";

const schema = mongoose.Schema;

const answerSchema:any = new schema({
    title:{
        type:String,
        required:true
    },

    des:{
        type:String,
        required:true
    },

    que_id:{
        type:String,
        required:true
    },

    user_id:{
        type:String,
        required:true
    },

    username:{
        type:String,
    },

    upvote:{
        type:Array
    },

    downvote:{
        type:Array
    },

    dateTime:{
        type:Date
    }


})

const Ans = mongoose.model('Answer',answerSchema);
export default Ans;