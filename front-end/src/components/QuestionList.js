import React from "react";
import { url } from "../API/data";
import imageExists from "../helpers/imgExists";

import "../css/index.css";


import { motion } from "framer-motion";

export default function QuestionList({ item, QuestionListref, id ,color}) {
  const date = new Date(item.dateTime);

  return (
    
      <motion.div 
      id={id}
      ref={QuestionListref} >
        
       { item.image?
       <div className="cardWithImage" style={{backgroundColor:color}}>
          <img src={`${url}/uploads/questions/${item.image}`} alt="" className="cardImg" />
         
         <div className="content">
            <h2 className="cardTitle">"{item.title}"</h2>
            <p className="uname">- {item.user}</p>  
            
         </div>
        </div>
          :
        <div className="cardWithoutImage" style={{backgroundColor:color}}>
          <h2 className="cardTitle">"{item.title}"</h2>
          <p className="uname">- {item.user}</p>  
        </div>}

        {/* <Card sx={{ margin: "100px 50px", maxWidth: 500 }}>
          <CardHeader
            title={item.user}
            subheader={`${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`}
          />

          {imageExists(`${url}/uploads/questions/${item.image}`) && (
            <CardMedia
              component="img"
              height="500"
              image={`${url}/uploads/questions/${item.image}`}
              alt="Paella dish"
            />
          )}
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <Typography
                component="div"
                variant="h5"
                sx={{ textTransform: "capitalize", textAlign: "left" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ textTransform: "capitalize", textAlign: "left" }}
                color="text.secondary"
                component="div"
              >
                {item.des}
              </Typography>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </CardActions>
          </Card>*/}
      </motion.div> 
    
  );
}
