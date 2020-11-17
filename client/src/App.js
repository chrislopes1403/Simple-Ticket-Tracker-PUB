import React from "react";
import {useState,useEffect} from "react";
import {
  BrowserRouter as Router, 
  Route,
  Redirect
} from 'react-router-dom';
import Login from './components/loginComponents/Login';
import authenticateUser from './components/helperFunctions/authenticate_func';
import {authorizeUser,handleLogout} from './components/helperFunctions/authorize_func';
import SpinnerPage from './components/SpinnerPage';
import Dashboard from './components/Dashboard/Dashboard';




function App() {
  const [auth,setAuth]= useState(false);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
  handleAuthorize();
  },[]);
  

 const Logins=() => 
{
  useEffect(() => {
   },[]);
 
  const { from } =  { from: { pathname: '/dashboard' } }


      const handleLogin= async(u,p)=>
      {
        let isAuth=await authenticateUser(u,p);
        if(isAuth)
        {
          setAuth(true);

        }
        else
        {
          setAuth(false);
        }

      }
  
   
      if (auth === true) 
      {
       return <Redirect to={from} />
      }
      else
      {
      return  <Login handleLogin={handleLogin}/>
      }

  
}


const handleAuthorize= async(u,p)=>
{
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const { from } =  { from: { pathname: '/dashboard' } }
  const { from2 } =  { from2: { pathname: '/login' } }

  if(await authorizeUser())
  {
    await delay(1000);
    setAuth(true);
    setLoading(false);
    return <Redirect to={from} />
  }
  else
  {
    await delay(1000);
    setAuth(false);
    setLoading(false);
    return <Redirect to={from2} />

  }



}




const PrivateRoute = ({ component: Component, ...rest }) => (
  
  <Route {...rest} render={(props) => (
    auth === true
      ? <Component {...props}  Logout={Logout} authorizeUser={authorizeUser} />
      : <Redirect to='/login' />
  )} />
)


const Logout =async() =>
{
  await handleLogout();
  setAuth(false);

}






if(loading)
{
  return <SpinnerPage/>
}
else{
 
      return (
        <Router>          
            <Route exact path="/login" component={Logins} />
            <PrivateRoute  exact path='/dashboard' component={Dashboard} />
            <Redirect  from="/" to="login" component={Logins} />
        </Router>
      );
    }
}




export default App;
