import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import { MDBBtn} from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';

const NavbarPage =(props)=>{

const handleLogout =()=>
{
props.Logout();
}

  return (
    <Router>
      <Navbar className="Main-Navbar" expand="lg" style={{ position: 'relative' }}>
          <Navbar.Brand className="Main-Navbar-Title" href="#">Ticket Tracker</Navbar.Brand>
          <MDBBtn color="primary" id="loginbutton" style={{ position: 'absolute',right: '10px'}}  onClick={handleLogout} >Logout</MDBBtn>
      </Navbar>
    </Router>
      );
  }


export default NavbarPage;