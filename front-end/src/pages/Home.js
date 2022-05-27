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
import Logout from "../helpers/Logout";
import TextInRound from "../components/TextInRound";
import "../css/index.css";
import { color } from "@mui/system";
import PostQuestion from "./PostQuestion";
import Spinner from "../components/Spinner";
export default function Home() {
  const { remember } = useContext(StorageContext);
  const [que, setque] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [pageCounter, setPageCounter] = useState(1);
  const [hasnew, sethasnew] = useState(true);
  const colors = [
    "#FE75AF",
    "#61FFAA",
    "#FFDF6B",
    "#66C8FF",
    "#FF6666",
    "#A9FF66",
  ];
  const observer = useRef();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

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
  //   useEffect( async() => {
  //     if (hasnew) {
  //       await axios
  //         .get(url + `/question/all?page=${pageCounter}`)
  //         .then((res) => {

  //             sethasnew(res.data.length);

  //             setque((prev) => [...prev, ...res.data]);

  //         })
  //         .catch((err) => alert(err));
  //         console.log("now",pageCounter);
  //         setisLoading(false);

  //     }
  //   }, []);

  const getQuestions = async () => {
    axios
      .get(url + `/question/all?page=${pageCounter}`)
      .then((res) => {
        setque((prev) => [...prev, ...res.data]);
        sethasnew(res.data.length > 0);
      })
      .catch((err) => alert(err));
  };
  useEffect(async () => {
    setisLoading(true);
    await getQuestions();
    setisLoading(false);
  }, [pageCounter]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "linear" }}
      className="home"
    >
      <div className="hero">
        <div className="top">
          <motion.h1
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            You have{" "}
          </motion.h1>

          <p className="roundtext">
            <TextInRound />
          </p>
        </div>
        <div className="bottom">
          <motion.h1
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            a Voice
          </motion.h1>
        </div>
      </div>
      <div className="intro">
        <h1>Share Your Story</h1>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil unde
          quos aliquid dolore error dicta assumenda odit nemo soluta
          accusantium, autem eaque, dolor labore voluptas omnis? Expedita nemo
          magnam ullam quibusdam repudiandae impedit, sunt nihil ea tenetur
          voluptate distinctio fuga eveniet dolorum doloribus amet, nobis sequi
          autem at rem adipisci tempore. Quos enim tenetur, recusandae vero,
          blanditiis cum, officiis quibusdam modi corporis ullam sequi
          aspernatur velit! Quidem ad quas, fugiat, fuga quae consectetur sed
          tempora cum nemo quasi exercitationem temporibus qui illum repellat
          voluptates, dignissimos nam provident. Impedit nisi dolore
          perspiciatis ab quos accusantium ullam aliquam? Reprehenderit corporis
          quasi quis.
        </p>
        <motion.div className="share">
          <Link to="/postquestion">
            {" "}
            Share your's
            <motion.i class="bi bi-arrow-up-right-circle-fill"></motion.i>
          </Link>
        </motion.div>
      </div>
      <div className="recents">Recent Stories</div>
      <div className="cardList">
        {/* { JSON.parse( localStorage.getItem("userData")).user} */}

        {que.length > 0 &&
          que.map((q, index) => (
            <motion.div
              initial={{ scale: 0, rotateZ: 10 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 50,
              }}
              className="card"
            >
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
            </motion.div>
          ))}
       
      </div>
      <div className="loader">
      <h1>
          {hasnew && (
            <Spinner/>
          )}
        </h1>
      </div>
    </motion.div>
  );
}
