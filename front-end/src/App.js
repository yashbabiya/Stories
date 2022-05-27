import { AnimatePresence,motion } from 'framer-motion';
import { createContext, useContext, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
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

      <Redirect to={props.redirectat} />
    :
    <props.layout>
      <Route path={props.path} render={props.component} {...props}/>
    </props.layout>
    )
  }


  const CheckCond = (props) =>{
    return(
    (props.isPrivate)?
    props.conditionForEnter?
        
      
      <Route path={props.path} render={props.component} {...props} />
     :

      <Redirect to={props.redirectat} />
    :
    
      <Route path={props.path} render={props.component} {...props}/>
    
    )
  }
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
            <Switch>
              <Route exact path='*'>
                {isLoggedin ? 
                <AuthLayout>
                  <Switch>
                    <CheckCond exact path='/'     component={Home} />
                    <CheckCond exact path='/postquestion'  component={PostQuestion} isPrivate={true} conditionForEnter={isLoggedin} redirectat='/login' />
                    <CheckCond exact path='/uploadimage'  component={UploadImage} isPrivate={true} conditionForEnter={isLoggedin} redirectat='/login' />
                    <CheckCond exact path='/question'      component={Question} />

                    <CheckCond exact path='/user'          component={UserProfile}/>
                    <CheckCond exact path='/edituser'      component={EditProfile} isPrivate={true} conditionForEnter={isLoggedin} redirectat='/login'/>

                    <CheckCond exact path='/explore'       component={Explore}/>
                    <CheckCond exact path='/editstory'     component={EditQuestion} isPrivate={true} conditionForEnter={isLoggedin} redirectat='/'/>
                    <Route path='*' component={NotFound} />

                  </Switch>
                </AuthLayout> 
                  :
                <NotAuthLayout>
                  <Switch>
                    <CheckCond exact path='/'             component={Home} />
                    <CheckCond exact path='/postquestion'  component={PostQuestion} isPrivate={true} conditionForEnter={isLoggedin} redirectat='/login' />
                    <CheckCond exact path='/question'      component={Question} />

                    <CheckCond exact path='/user'          component={UserProfile}/>

                    <CheckCond exact path='/explore'       component={Explore}/>
                    <CheckCond exact path='/login'        component={Login} isPrivate={isLoggedin} conditionForEnter={!isLoggedin} redirectat='/'/>
                    <CheckCond exact path='/signup'       component={Signup} isPrivate={isLoggedin} conditionForEnter={!isLoggedin}  redirectat='/'/>
                    <Route path='*' component={NotFound} />
                  </Switch>         
                </NotAuthLayout> }
              </Route>
              
              
            </Switch>
            </AnimatePresence>
          </userDataContext.Provider>
        </StorageContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}




export default App;
