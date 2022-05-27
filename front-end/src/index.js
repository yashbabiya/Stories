import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import { BrowserRouter} from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';


ReactDOM.render(
  
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
    
  
  ,
  document.getElementById('root')
);


