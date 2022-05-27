import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axios from "axios";
import { url } from "../API/data";
import { AuthContext, StorageContext, userDataContext } from "../App";
import { Redirect, Router, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [uname, setuname] = useState("");
  const [password, setpassword] = useState("");
  const { remember, setRemember } = useContext(StorageContext);
  let { isLoggedin, setIsLoggedin } = useContext(AuthContext);
  let { userData, setuserData } = useContext(userDataContext);

  let history = useHistory();

  const loginAction = async () => {

    if(uname===null || password===null)
    alert("Put something in that boxes")
    await axios
      .post(url + "/auth/login", { user: uname, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "userData",
          JSON.stringify({
            id: res.data._id,
            user: res.data.username,
            biotitle: res.data.btitle,
            biodetail: res.data.bbio,
            email: res.data.email,
            profile: res.data.profile,
            questions: res.data.questions,
          })
        );
        setIsLoggedin(true);
        history.push("/");
      })
      .catch((err) => {
        alert("Invalid Username or password");
        setuname("");
        setpassword("");
      });
  };
  return (
    
      <motion.div
        className="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <h1>Login</h1>

        <div>
        <p>Username :</p>
        <input
          required
          // id="outlined-required"
          className="doubleBorderedInput"
          label="Title"
          defaultValue=""
          value={uname}
          onChange={(e) => setuname(e.target.value)}
        />
        </div>

        <div>
        <p>Password :</p>
        <input
          required
          // id="outlined-required"
          className="doubleBorderedInput"
          type="password"
          defaultValue=""
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        </div>

        

        <button className="doubleBorderdButton" onClick={loginAction}>
          submit
        </button>
        <div>
          <Link to="/signup">Create a new one !! </Link> 
          
        </div>
      </motion.div>
    
  );
}
