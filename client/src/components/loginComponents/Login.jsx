import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn} from 'mdbreact';
import {useForm} from "react-hook-form";
const Login = (props) => {

const {register,handleSubmit}=useForm();

const handlelogin =(data) =>
{
    document.getElementById('user').value="";
    document.getElementById('pass').value="";
    props.handleLogin(data.username,data.password);
}


return (
<MDBContainer id="logins">

  <MDBRow>
    <MDBCol>
      <form onSubmit={handleSubmit(handlelogin)} method="POST">
        <p className="h5 text-center mb-4 login-title">Ticket Tracker</p>
        <div className="grey-text">
        <label >Username</label>
         <input  className="form-control mb-3" name="username" ref={register} placeholder="Username" id="user"></input>
         <label >Password</label>
         <input  className="form-control  mb-3" name="password" ref={register}  placeholder="Password"  id="pass"></input>
         
        </div>
        <div className="text-center">
          <MDBBtn color="primary" id="loginbutton" type="submit" >Login</MDBBtn>
        </div>
      </form>
    </MDBCol>
  </MDBRow>
</MDBContainer>
);
};

export default Login;