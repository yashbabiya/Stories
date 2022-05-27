import axios from "axios";
import { motion } from "framer-motion";
import React, { useState,useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { url } from "../API/data";

export default function EditQuestion() {
    const [title, settitle] = useState("")
    const [des, setdes] = useState("")
    const [data, setData] = useState()
    const history = useHistory();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const postQuestion = () =>{
        
        axios.post(url+`/question/edit?id=${id}`,{title,des},{headers: {
            "authorization":  localStorage.getItem("token") //the token is a variable which holds the token
          }
        }).then( (res)=>{
          // alert("done")
            history.push(`/`)
        } ).catch(()=>{
            alert('you are not the user who has posted this')
        })
    }

    useEffect(() => {
        
        axios.get(url + `/question/getQuestion?id=${id}`).then((res) => {
            settitle(res.data.title)
            setdes(res.data.des)
        });
    }, [])
  return (
    <div>
      <motion.div
        className="PostPage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h1>Edit Your Story</h1>

        <motion.div
          className="postForm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div>
            <p>Title:</p>
            <input
              required
              // id="outlined-required"
              className="doubleBorderedInput"
              label="Title"
              defaultValue=""
              value={title}
              onChange={(e) => settitle(e.target.value)}
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
              onChange={(e) => setdes(e.target.value)}
            ></textarea>
          </div>

          <button className="doubleBorderdButton" onClick={postQuestion}>
            Edit
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
