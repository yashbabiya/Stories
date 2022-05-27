import { Button, TextField } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { Route, useHistory, useLocation, useParams } from "react-router";
import {Link} from 'react-router-dom';
import { url } from "../API/data";
import SkeletonX from "../components/Skeleton";
import "../css/index.css";
import colors from "../helpers/colors";
import imageExists from "../helpers/imgExists";

export default function Question() {
  const history = useHistory();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");

  const [data, setData] = useState([]);
  const [ansId, setAnsId] = useState([]);
  const [isFollowed, setIsfollowed] = useState(false);
  const [flws, setflws] = useState();
  const [advance, setadvance] = useState(false);
  const [loading, setloading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(0);
  const [voteIndex, setVoteIndex] = useState(-1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(async () => {
    axios.get(url + `/question/getQuestion?id=${id}`).then((res) => {
      setData(res.data);
      console.log(res.data);
      setflws(res.data.followers.length);
      if (!!localStorage.getItem("userData")) {
        setadvance(
          JSON.parse(localStorage.getItem("userData")).user === res.data.user
        );
      }
      if (!!localStorage.getItem("userData")) {
        res.data.followers.map((ff) => {
          if (ff == JSON.parse(localStorage.getItem("userData")).id)
            setIsfollowed(true);
        });
      }
      setloading(false);
    });

    axios
      .get(url + `/answer/ansOfQuestion?id=${id}`)
      .then((res) => {
        setAnsId(res.data);
      })
      .catch();
  }, []);
  const [title, setTitle] = useState();
  const [des, setdes] = useState();

  const putAnswer = async () => {
    axios
      .post(
        url + `/answer/putAnswer`,
        { title, des, que_id: id },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        setTitle("");
        setdes("");
        window.location.reload(false);
      })
      .catch(() => {
        alert("ans not uploaded");
      });
  };

  const follow = () => {
    const questions = JSON.parse(localStorage.getItem("userData")).questions;

    isFollowed ? setflws(flws - 1) : setflws(flws + 1);

    if (isFollowed) {
      const ii = questions.indexOf(id);
      if (ii > -1) {
        questions.splice(ii, 1);
      }
    } else {
      questions.push(id);
    }

    let userData = JSON.parse(localStorage.getItem("userData"));
    userData = {
      ...userData,
      questions,
    };
    localStorage.setItem("userData", JSON.stringify(userData));

    setIsfollowed(!isFollowed);
    axios
      .get(url + `/question/follow?id=${id}`, {
        headers: { authorization: localStorage.getItem("token") },
      })
      .then(() => {});
  };

  const upvote = async (aid, index) => {
    if (!localStorage.getItem("token")) {
      alert("Please Login first");
    } else {
      setVoteLoading(1);
      setVoteIndex(index);
      await axios
        .get(url + `/answer/upvote?id=${aid}`, {
          headers: { authorization: localStorage.getItem("token") },
        })
        .catch(() => {
          alert("Cant do upvote if downvoted");
        });

      axios
        .get(url + `/answer/ansOfQuestion?id=${id}`)
        .then((res) => {
          setAnsId(res.data);
          setVoteLoading(0);
          setVoteIndex(-1);
        })
        .catch();
    }
  };
  const downvote = async (aid, index) => {
    setVoteLoading(2);
    setVoteIndex(index);
    await axios
      .get(url + `/answer/downvote?id=${aid}`, {
        headers: { authorization: localStorage.getItem("token") },
      })
      .catch(() => {
        alert("Cant do downvote if upvoted");
      });

    axios
      .get(url + `/answer/ansOfQuestion?id=${id}`)
      .then((res) => {
        setAnsId(res.data);
        setVoteLoading(0);
        setVoteIndex(-1);
      })
      .catch();
  };
  const deleteQuestion = async ()=>{
    axios.get(url+`/question/delete?id=${id}`,{
      headers: { authorization: localStorage.getItem("token") },
    }).then(() => {
      alert("Question is Deleted")
      history.push('/')
    });
  }
  return (
    <motion.div
      className="questionPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {loading ? (
        <div>
          <SkeletonX />
          <SkeletonX />
          <SkeletonX />
        </div>
      ) : (
        <div>
          <div
            className="heroDiv"
            style={{
              backgroundImage: `url(${url}/uploads/questions/${data.image})`,
            }}
          >
            {/* {imageExists(url+`/uploads/questions/${data.image}`) && <img className="heroForPage" src={url+`/uploads/questions/${data.image}`} />} */}

            <div className="heroCont">
              {!!localStorage.getItem("userData") && (
                <p className="save" >
                  <div onClick={follow}>
                  {isFollowed ? (
                    <motion.div whileTap={{ rotate: -20, scale: 0.8 }}>
                      <i class="bi bi-bookmark-fill"></i>
                    </motion.div>
                  ) : (
                    <motion.div whileTap={{ rotate: 10, scale: 0.8 }}>
                      <i class="bi bi-bookmark"></i>
                    </motion.div>
                  )}
                  </div>
                  {advance && (
                    <>
                      {" "}
                      <Link to={`/editstory?id=${id}`}>
                        <i class="bi bi-pencil-fill"></i>{" "}
                      </Link>{" "}
                      
                        <i onClick={deleteQuestion} class="bi bi-trash-fill"></i>{" "}
                      {" "}
                      <Link to={`/uploadimage?id=${id}&img=${data.image}`}>
                      <i class="bi bi-file-earmark-image"></i>{" "}
                      </Link>
                    </>
                  )}
                </p>
              )}
              <h1>{data.title}</h1>
              <p>-{data.user}</p>
              {/* {flws    } */}
            </div>
          </div>

          <div className="main">
            <pre>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {data.des}
            </pre>

            <h1>Comments</h1>
            <div className="comments">
              {ansId.length != 0 &&
                ansId.map((ans, index) => (
                  <div
                    style={{ backgroundColor: colors[index % colors.length] }}
                    className="commentCard"
                  >
                    <div className="content">
                      <h1>"{ans.title}"</h1>
                      <p>{ans.des}</p>
                    </div>
                    <div className="commentDetails">
                      <div className="postDetails">
                        <b>{ans.username}</b>
                        <p>{new Date(ans.dateTime).toLocaleDateString()} </p>
                        <p>{new Date(ans.dateTime).toLocaleTimeString()}</p>
                      </div>

                      {localStorage.getItem("token") && (
                        <div className="vote">
                          {/* <>{voteLoading ? <motion.div initial={{scale:0.5}} animate={{scale:2}} >Loading</motion.div>: null}</> */}
                          <>
                            {voteLoading == 1 && voteIndex == index ? (
                              <div>
                                <motion.div
                                  className="voteLoading"
                                  initial={{ rotate: 0 }}
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: 100, duration: 1 }}
                                >
                                  <i
                                    class={
                                      ans.upvote &&
                                      ans.upvote.includes(
                                        JSON.parse(
                                          localStorage.getItem("userData")
                                        ).id
                                      )
                                        ? "bi bi-arrow-up-circle-fill"
                                        : "bi bi-arrow-up-circle"
                                    }
                                  ></i>
                                </motion.div>
                              </div>
                            ) : (
                              <i
                                onClick={() => upvote(ans._id, index)}
                                class={
                                  ans.upvote &&
                                  ans.upvote.includes(
                                    JSON.parse(localStorage.getItem("userData"))
                                      .id
                                  )
                                    ? "bi bi-arrow-up-circle-fill"
                                    : "bi bi-arrow-up-circle"
                                }
                              ></i>
                            )}

                            <p> {ans.upvote && ans.upvote.length} </p>

                            {voteLoading == 2 && voteIndex == index ? (
                              <div>
                                <motion.div
                                  className="voteLoading"
                                  initial={{ rotate: 0 }}
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: 100, duration: 1 }}
                                >
                                  <i
                                    class={
                                      ans.downvote &&
                                      ans.downvote.includes(
                                        JSON.parse(
                                          localStorage.getItem("userData")
                                        ).id
                                      )
                                        ? "bi bi-arrow-down-circle-fill"
                                        : "bi bi-arrow-down-circle"
                                    }
                                  ></i>
                                </motion.div>
                              </div>
                            ) : (
                              <i
                                onClick={() => downvote(ans._id, index)}
                                class={
                                  ans.downvote &&
                                  ans.downvote.includes(
                                    JSON.parse(localStorage.getItem("userData"))
                                      .id
                                  )
                                    ? "bi bi-arrow-down-circle-fill"
                                    : "bi bi-arrow-down-circle"
                                }
                              ></i>
                            )}

                            <p>{ans.downvote && ans.downvote.length} </p>
                          </>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {!!localStorage.getItem("userData") && (
              <div>
                <h1>Add Your Thought</h1>

                {/* <TextField
                  required
                  id="outlined-required"
                  label="Title"
                  defaultValue=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                  required
                  id="outlined-textarea"
                  label="Description"
                  multiline
                  rows={5}
                  value={des}
                  onChange={(e) => setdes(e.target.value)}
                /> */}

                <div>
                  <p>Title:</p>
                  <input
                    required
                    // id="outlined-required"
                    className="doubleBorderedInput"
                    label="Title"
                    defaultValue=""
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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

                <button
                  className="doubleBorderdButton"
                  variant="contained"
                  onClick={putAnswer}
                >
                  Post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
