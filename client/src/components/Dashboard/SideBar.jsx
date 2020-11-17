import React, { useState,useEffect } from 'react';

import Nav from 'react-bootstrap/Nav';

const SideBar = (props) => {
 

  
  const [sidelinks, setSideLinks] = useState([
     
      {
        id:   0,
        name: 'DashBoard',
        displayLink: true,
        role:"admin teamleader"
      },
     
      {
        id:   1,
        name: 'AllProjects',
        displayLink: true,
        icon:"bars",
        role:"admin teamleader dev"
      },
      {
        id:   2,
        name: 'AllTickets',
        displayLink: true,
        icon:"ticket-alt",
        role:"admin teamleader dev"

      }, 
      {
        id:   3,
        name: 'MyProfile',
        displayLink: true,
        icon:"user",
        role:"admin teamleader dev"

      }
    ] 
     
    );

   
     const handleSelect = (eventKey) => {
    
      sidelinks.map((item,i)=>{
          if(item.displayLink)
          {
            var str = "circle-"+ i;
            document.getElementById(str).style.visibility="hidden"; 
          }
        })


      var str = "circle-"+eventKey;
      document.getElementById(str).style.visibility="visible";

      props.handlePage(eventKey);
      };







    const  loadPremissons =() =>
    {
    
                
          if(props.premissions)
          { 
          var pre =props.premissions;
          setSideLinks(
          sidelinks.map(item => 
              (item.role.search(pre.userlvl) < 0)
              ? {...item, displayLink : !item.displayLink} 
              : item 
            ))

          
              if(props.premissions.userlvl==="admin" || props.premissions.usrlvl==="teamleader")
                document.getElementById("circle-0").style.visibility="visible";
              else
                document.getElementById("circle-1").style.visibility="visible";

            }


    }

  

  useEffect(() => {
      loadPremissons();
 },[]);




  return( 
    <Nav  className="Main-SideNav" activeKey="1" as="ul" onSelect={handleSelect}>
            <Nav.Item className="nav-top" key={0}>   
              <Nav.Link className="SideNav-Link"><i className="fa fa-user"></i>{props.premissions.username}</Nav.Link>
            </Nav.Item>
            <hr/>    

            {sidelinks.map((item,i)=>{
                if(item.displayLink)
                {
                  var str = "circle-"+ i;
                  return <Nav.Item key={i+1} >
                            <Nav.Link   className="SideNav-Link" 
                                        eventKey={i}>                                         
                            <i className="fa fa-circle" id={str}></i>{item.name}
                            </Nav.Link>
                        </Nav.Item>
                }
            })}
           
        </Nav>
  );

 
  
     }
 
export default SideBar;

