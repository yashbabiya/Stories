import * as React from "react";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { url } from "../API/data";
import imageExists from "../helpers/imgExists";
import "../css/index.css";
import { motion } from "framer-motion";

export default function AuthHeader() {
  const { isLoggedin, setIsLoggedin } = React.useContext(AuthContext);
  const history = useHistory();
  const ref = React.useRef()
  const [style, setStyle] = React.useState(true)
  const logout = () => {
    localStorage.clear();
    setIsLoggedin(false);
    history.push("/");
  };
  const userdata = JSON.parse(localStorage.getItem("userData"));
  return (
    <div className="authheader">
      <ul className="bigHeader">
        <div className="left">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>
        </div>


        <li>
          <div className="logo"> Stories </div>
        </li>


        <div className="right">
        <li>
          <Link to="/postquestion">Share your story</Link>
        </li>

        <li>
          <p style={{cursor:"pointer"}} onClick={logout}>Logout</p>
        </li>
        <li className="userProfile" onClick={()=>{
            // ref.current.style.display = style ? "flex" : "none"
            ref.current.style.opacity = style ? 1 : 0
            ref.current.style.pointerEvents = style ? "all" : "none"
            setStyle(!style);
          }}>
          <div className="userProfile" 
        >
          {userdata &&
          userdata.profile ? (
            <img
              id="userInHeader"
              src={`${url}/uploads/users/${userdata.profile}.jpg`}
            />
          ) : (
            <i id="userInHeader" class="bi bi-person-circle"></i>
          )}
          </div>

          <motion.div ref={ref} className="more">
            <ul>
              <Link to='/edituser'><li>Add Account Details</li></Link>
              
            </ul>
          </motion.div>
        </li>


        </div>
      </ul>
      <div className="miniHeader inAuthHeader">
        <div className="llogo">
          <div className="logo"> Stories </div>
        </div>
        <div className="menu">
        <Link to="/"><i class="bi bi-house-fill"></i></Link>
        <Link to="/explore"><i class="bi bi-compass-fill"></i></Link>
        <Link to="/postquestion"><i class="bi bi-file-earmark-post-fill"></i></Link>
        <i class="bi bi-door-open-fill"  onClick={logout}></i>
        <Link to="/edituser"><i class="bi bi-person-plus-fill"></i></Link>
        </div>
      </div>
    </div>
  );
}
