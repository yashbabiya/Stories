import * as React from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { url } from "../API/data";
import imageExists from "../helpers/imgExists";
import "../css/index.css";

export default function Header() {
  const { isLoggedin, setIsLoggedin } = React.useContext(AuthContext);
  const history = useHistory();
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
            <Link to="/login">Login</Link>
          </li>
        </div>
      </ul>
      <div className="miniHeader">
        <div className="llogo">
          <div className="logo"> Stories </div>
        </div>
        <div className="menu">
        <Link to="/"><i class="bi bi-house-fill"></i></Link>
        <Link to="/explore"><i class="bi bi-compass-fill"></i></Link>
        <Link to="/login"><i class="bi bi-door-open-fill"></i></Link>
        </div>
      </div>
    </div>
  );
}
