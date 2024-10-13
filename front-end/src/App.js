import { AnimatePresence,motion } from 'framer-motion';
import { createContext, useContext, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Routes } from 'react-router-dom';

import './css/index.css';
import AuthLayout from './layouts/AuthLayout';
import Layout from './layouts/Layout';
import NotAuthLayout from './layouts/NotAuthLayout';
import NotFound from './pages/404';
import EditProfile from './pages/EditProfile';
import EditQuestion from './pages/EditQuestion';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Login from './pages/Login';
import PostQuestion from './pages/PostQuestion';
import Question from './pages/Question';
import Signup from './pages/Signup';
import UploadImage from './pages/UploadImage';
import UserProfile from './pages/UserProfile';
import { Navigate } from 'react-router-dom'


let isAuthenticated = false
export const AuthContext = createContext();
export const StorageContext = createContext();
export const userDataContext = createContext();
function App() {
  let [remember,setRemember]  = useState(false)
  let [isLoggedin, setIsLoggedin] = useState(!!localStorage.getItem("token"))
  let [userData,setuserData] = useState({});
  
  const layout = isLoggedin ? AuthLayout : NotAuthLayout
  const RouteWrapper = (props) =>{
    return(
    (props.isPrivate)?
    props.conditionForEnter?
        
      <props.layout>
      <Route path={props.path} render={props.component} {...props} />
     </props.layout>:

      <Navigate to={props.redirectat} />
    :
    <props.layout>
      <Route path={props.path} render={props.component} {...props}/>
    </props.layout>
    )
  }

  const CheckCond = (props) => {
    // If it's private and the condition for entering is false, redirect
    if (props.isPrivate && !props.conditionForEnter) {
      return <Navigate to={props.redirectat} />;
    }
  
    // Return a Route if conditions are met
    return <Route path={props.path} element={<props.component />} />;
  };
  // let routes = [
  //   {
  //     "path":'/',
  //     "component":Home,
  //     "isPrivate":false,
  //     "conditionForEnter":null,
  //     "layout"
  //   },
  //   {
  //     "path":'/',
  //     "component":Home,
  //     "isPrivate":false,
  //     "conditionForEnter":null
  //   }
  // ]


  return (
    <div className="App">
      <AuthContext.Provider value={{isLoggedin, setIsLoggedin}}>
        <StorageContext.Provider value={{remember,setRemember}}>
          <userDataContext.Provider value={{userData,setuserData}}>
            <AnimatePresence>
            <Routes>
      <Route path='*' element={isLoggedin ? (
        <AuthLayout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/postquestion' element={isLoggedin ? <PostQuestion /> : <Navigate to='/login' />} />
            <Route path='/uploadimage' element={isLoggedin ? <UploadImage /> : <Navigate to='/login' />} />
            <Route path='/question' element={<Question />} />
            <Route path='/user' element={<UserProfile />} />
            <Route path='/edituser' element={isLoggedin ? <EditProfile /> : <Navigate to='/login' />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/editstory' element={isLoggedin ? <EditQuestion /> : <Navigate to='/' />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthLayout>
      ) : (
        <NotAuthLayout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/postquestion' element={isLoggedin ? <PostQuestion /> : <Navigate to='/login' />} />
            <Route path='/question' element={<Question />} />
            <Route path='/user' element={<UserProfile />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/login' element={!isLoggedin ? <Login /> : <Navigate to='/' />} />
            <Route path='/signup' element={!isLoggedin ? <Signup /> : <Navigate to='/' />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </NotAuthLayout>
      )} />
    </Routes>
            </AnimatePresence>
          </userDataContext.Provider>
        </StorageContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}




export default App;
