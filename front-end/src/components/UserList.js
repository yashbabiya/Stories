import React from 'react'
import { url } from '../API/data'
import imageExists from '../helpers/imgExists'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import '../css/index.css'

import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';

export default function UserList({item,color}) {
   
    
    return (
      <motion.div>
        <div className="userListCard" style={{backgroundColor:color}}>
              {item.profile &&
              
            <div className="image">
              <img alt="@" src={`${url}/uploads/users/${item.profile}.jpg`} 
              
              />
            </div>
              }
            <div className="content">
                <h3>{item.username}</h3>
                <p>{item.email}</p>
            </div>
        </div>
      </motion.div>
    )
}
