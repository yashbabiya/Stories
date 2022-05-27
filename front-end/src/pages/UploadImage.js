import axios from 'axios'
import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { url } from '../API/data'

export default function UploadImage() {
    const history = useHistory();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get('id');
    const img = new URLSearchParams(search).get('img')
    
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    
    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
        

        
        const [file] = event.target.files
        const blah = document.getElementById('blah')
        if (file) {
            blah.src = URL.createObjectURL(file)
        }
		
	};

    const handleSubmission = () => {
		const formData = new FormData();
        var filesize = ((selectedFile.size/1024)/1024).toFixed(4); 
        if(filesize>2)
        {
            alert("File is too large !!")
            
        }
        else
		{
                formData.append('image', selectedFile);

            fetch(
                `${url}/question/upload?id=${id}`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
                .then((response) => response.json())
                .then((result) => {
                    console.log('Success:', result);
                    history.push('/')   
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
	}
    
    return (
        <div className="Uploadphoto">
            <div>
           <label> 
           <input  accept="image/*" type="file" name="image" id="imgInp" onChange={changeHandler} />
           <h4>Choose a file <i class="bi bi-cloud-arrow-up"></i> </h4>
           </label>
           <Link to='/'><u>Dont want to include image </u></Link>
           <div><button className="doubleBorderdButton" onClick={handleSubmission}>Submit</button></div>
           </div>
           <img className="preview" id="blah" src={img?`${url}/uploads/questions/${img}`:"#"} alt="Preview of your image" />
        </div>
    )
}
