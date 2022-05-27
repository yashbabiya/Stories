import { TextareaAutosize } from '@mui/material'
import { motion } from 'framer-motion'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import React, { useState } from 'react'
import axios from 'axios';
import { url } from '../API/data';
import { useHistory } from 'react-router';

export default function PostQuestion() {
    const [title, settitle] = useState("")
    const [des, setdes] = useState("")
    const history = useHistory();
    const postQuestion = () =>{
        
        axios.post(url+'/question/post',{title,des},{headers: {
            "authorization":  localStorage.getItem("token") //the token is a variable which holds the token
          }
        }).then( (res)=>{
          // alert("done")
            history.push(`/uploadimage?id=${res.data._id}`)
        } )
    }
    return (
        <motion.div className="PostPage" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>

          <h1>Share Your Story</h1>
                
      <motion.div className="postForm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div>
          <p>Title:</p>
          <input
            required
            // id="outlined-required"
            className="doubleBorderedInput"
            label="Title"
            defaultValue=""
            value={title}
            onChange={(e)=>settitle(e.target.value)}
          />
        </div>
        <div>
          <p>Story:</p>
          <textarea
            required
            // id="outlined-textarea"
            label="Description"
            className="doubleBorderedInput"
            rows="10"
          
            value={des}
            onChange={(e)=>setdes(e.target.value)}
          >
            </textarea>
        </div>


        
        <button className="doubleBorderdButton" onClick={postQuestion}>Post</button>
        
        </motion.div>
        
        </motion.div>
    )
}

