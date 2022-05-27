import React from 'react'
import { url } from '../API/data'
import imageExists from '../helpers/imgExists'

export default function CardForList({data,color}) {
    
    return (
        <div className="simpleCard" style={{backgroundColor:color}}>
            {
            data.image
            &&
            <img src={`${url}/uploads/questions/${data.image}`} />
            }
            <h1 >{data.title}</h1>
            
        </div>
    )
}
