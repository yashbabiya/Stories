import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import axios from "axios";
import { url } from "../API/data";
import { AuthContext, StorageContext, userDataContext } from "../App";
import { Redirect, Router, useHistory } from "react-router";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Signup() {
  const [uname, setuname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");

  let history = useHistory();

  const signupaction = async () => {
    await axios
      .post(url + "/auth/signup", { user: uname, password, email })
      .then(() => {
        alert("User successfully created login with that account");
        history.push("/login");
      })
      .catch((err) => {
        alert("User not Created");
      });
  };
  return (
    <motion.div
      className="login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>SignUp</h1>
      <div>
        <p>Username :</p>
        <input
          required
          // id="outlined-required"
          className="doubleBorderedInput"
          defaultValue=""
          value={uname}
          onChange={(e) => setuname(e.target.value)}
        />
      </div>

<div>
<p>Email :</p>
      <input
        required
        // id="outlined-required"
        className="doubleBorderedInput"
        defaultValue=""
        type="email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
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
      <button className="doubleBorderdButton" onClick={signupaction}>
        submit
      </button>

      <div>
          <Link to="/login">Already have a account</Link> 
          
        </div>
    </motion.div>
  );
}
