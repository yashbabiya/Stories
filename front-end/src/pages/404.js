import { motion } from "framer-motion";
import React, { useRef } from "react";
import colors from "../helpers/colors";

export default function NotFound() {
    const constraintsRef = useRef(null)
    return (
    <motion.div className="notFound" ref={constraintsRef}>
      <div className="title">
      <motion.div drag dragConstraints={constraintsRef} ><h1 style={{ color: colors[0] }}>4</h1></motion.div>
        
      <motion.div drag dragConstraints={constraintsRef} > <h1 style={{ color: colors[1] }}>0</h1></motion.div>
       
      <motion.div drag dragConstraints={constraintsRef} > <h1 style={{ color: colors[2] }}>4</h1></motion.div>

      </div>
      <motion.p drag dragConstraints={constraintsRef}>This is not what you want But you may have fun</motion.p>
      {/* <div className="square1"></div> */}
      {/* <motion.div className="square1" ref={constraintsRef}> */}
        {/* <motion.div className="square1" drag dragConstraints={constraintsRef} /> */}
        {/* <motion.div className="square2" drag dragConstraints={constraintsRef} /> */}
        {/* <motion.div className="round" drag dragConstraints={constraintsRef} > */}
        

            {/* </motion.div> */}

      {/* </motion.div> */}
      {/* <div className="square2"></div>
      <div className="square3"></div>

      <div className="round"></div> */}
    </motion.div>
  );
}
