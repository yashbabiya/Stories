import { TextField } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { url } from "../API/data";
import { AuthContext } from "../App";

export default function EditProfile() {
  const [title, settitle] = useState();
  const [des, setdes] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const history = useHistory();
  const { isLoggedin, setIsLoggedin } = React.useContext(AuthContext);


  const handleSubmission = () => {
    const theImage = new FormData();

    theImage.append('image', selectedFile);
    let uname = JSON.parse(localStorage.getItem("userData")).user;
    let uid = JSON.parse(localStorage.getItem("userData")).id;

    const data = {
      btitle: title,
      bbio: des,
    };
    
    axios
      .patch(url + `/user/edit?id=${uid}`, data, {
        headers: { authorization: localStorage.getItem("token") },
      })
      .then((data) => {
        
        axios
        .post(url + `/user/upload`, theImage, {
          headers: { authorization: localStorage.getItem("token") },
        }).then((result) => {
          
          console.log("opoppo",result);
            localStorage.clear();
            setIsLoggedin(false);
            history.push("/login");
          })
          .catch((error) => {
            alert("Image not uploaded");
            localStorage.clear();
            setIsLoggedin(false);
            history.push("/login");
          });
      });
  };

  return (
    <motion.div
        className="PostPage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h1>Edit Your Bio-Details</h1>

        <motion.div
          className="postForm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
      
      <div>
           <p>Bio Title :</p> 
          <input
            required
            // id="outlined-required"
            className="doubleBorderedInput"
            label="BioTitle"
            defaultValue=""
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
      </div>
      <div>
           <p>Bio Description :</p> 
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

      <div>
        <p>Profile image : </p>
        <input type="file" name="image" onChange={(e) => {setSelectedFile(e.target.files[0]);}} />
      </div>
      <button onClick={handleSubmission}>Submit</button>
      </motion.div>
    </motion.div>
  );
}
