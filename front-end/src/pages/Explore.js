import { Avatar } from "@mui/material";
import axios, { Axios } from "axios";
import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { url } from "../API/data";
import { AuthContext, StorageContext } from "../App";
import QuestionList from "../components/QuestionList";
import SkeletonX from "../components/Skeleton";
import Spinner from "../components/Spinner";
import UserList from "../components/UserList";
import Logout from "../helpers/Logout";

export default function Explore() {
  const { remember } = useContext(StorageContext);
  const [que, setque] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [pageCounter, setPageCounter] = useState(1);
  const [hasnew, sethasnew] = useState(true);

  const [keyW, setKeyW] = useState();
  const [filter, setFilter] = useState("question");

  const observer = useRef();
  const QuestionListref = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      console.log(pageCounter);

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasnew) {
          setPageCounter((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasnew]
  );

  useEffect(() => {
    // axios
    //   .get(url + `/question/all?page=${1}`)
    //   .then((res) => {
    //     setque((prev) => [...prev, ...res.data]);
    //   })
    //   .catch((err) => alert(err));
  }, []);

  const search = async () => {
    setisLoading(true);
    await axios
      .get(url + `/${filter}/search?keyword=${keyW}`)
      .then((res) => {
        setque(res.data);
        sethasnew(res.data.length > 0);
      })
      .catch((err) => alert(err));
    setisLoading(false);
  };

  const colors = [
    "#FE75AF",
    "#61FFAA",
    "#FFDF6B",
    "#66C8FF",
    "#FF6666",
    "#A9FF66",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 100 }}
      className="Explore"
    >
      <div className="search">
        <input
          type="text"
          className="searchbar"
          value={keyW}
          onChange={(e) => setKeyW(e.target.value)}
        />

        <button onClick={search} className="searchbtn">
          <i class="bi bi-search"></i>
        </button>
      </div>
      <div className="selector">
        Search For :
        <input
          type="radio"
          id="story"
          name="filt"
          defaultChecked
          onClick={() => {
            setFilter("question");
            setque([]);
            setKeyW("");
          }}
        />
        <input
          type="radio"
          name="filt"
          // className={filter==="user"?"checkedradio":""}
          id="user"
          onClick={() => {
            setFilter("user");
            setque([]);
            setKeyW("");
          }}
        />
        <label
          htmlFor="story"
          className={filter === "question" ? "checkedradio" : ""}
        >
          Story
        </label>
        <label
          htmlFor="user"
          className={filter === "user" ? "checkedradio" : ""}
        >
          User
        </label>
      </div>
      <div className="exploreList">
        {isLoading ? (
          <Spinner />
        ) : filter === "question" ? (
          que.length === 0 ? (
            <h1>No results found</h1>
          ) : (
            que.map((q, index) => (
              <Link to={`/question?id=${q._id}`}>
                <QuestionList
                  item={q}
                  color={colors[index % colors.length]}
                  QuestionListref={
                    que.length === index + 1 ? QuestionListref : null
                  }
                  id={que[que.length - 1] === q ? "last" : null}
                />
              </Link>
            ))
          )
        ) : que.length === 0 ? (
          <h1>No results found</h1>
        ) : (
          que.map((q, index) => (
            <Link to={`/user?id=${q._id}`}>
              <UserList item={q} color={colors[index % colors.length]} />
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
}
