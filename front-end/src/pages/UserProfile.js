import { Avatar, Tab } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { url } from "../API/data";
import BasicTabs from "../components/BasicTabs";
import CardForList from "../components/CardForList";
import imageExists from "../helpers/imgExists";
import colors from "../helpers/colors";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
export default function UserProfile() {
  const [data, setData] = useState(null);
  const [counter, setCounter] = useState(0);
  const [isloading, setisloading] = useState(true)
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const getData = async() => {
    setisloading(true)
    await axios
      .get(url + `/user/userById?id=${id}`)
      .then((res) => setData(res.data))
      .catch(() => setData([]));
      setisloading(false)
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!isloading &&data ? (
        <div className="profilePage">
          <div className="personalinfo">
            {data.profile&& (
              <img
                className="userImage"
                alt="#"
                src={`${url}/uploads/users/${data.profile}.jpg`}
              />
            )}

            <h1>{data.username}</h1>
            <p>{data.email}</p>
          </div>
          <div className="bio">
            <b>About me</b>
            <h4>{data.bio_title}</h4>
            <p>{data.bio_des}</p>
          </div>

          {/* <BasicTabs
            i1={data.questions}
            i2={data.askedByMe}
            i3={data.answers}
          /> */}

          <input
            type="radio"
            id="followed"
            name="filter"
            defaultChecked
            onClick={() => {
              setCounter(0);
            }}
          />
          <input
            type="radio"
            name="filter"
            // className={filter==="user"?"checkedradio":""}
            id="byMe"
            onClick={() => {
              setCounter(1);
            }}
          />
        <div className="switchSt">
          <label
            htmlFor="followed"
            className={counter === 0 ? "checkedradio" : ""}
          >
            Followed Stories
            
          </label>
          <label
            htmlFor="byMe"
            className={counter ===1 ? "checkedradio" : ""}
          >
            Stories by user
          </label>
          </div>

          {counter == 0 ?
            <>
                
                {data.questions.map((q,index)=><Link to={`/question?id=${q._id}`}><CardForList color={colors[index % colors.length]} data={q}/></Link>)}
            </> :
           <>
                {data.askedByMe.map((q,index)=><Link to={`/question?id=${q._id}`}><CardForList color={colors[index % colors.length]} data={q}/></Link>)}
           </>}
        </div>
      ) :<div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",minHeight:"60vh",fontSize:"3em"}}> <Spinner/></div>}
    </motion.div>
  );
}
