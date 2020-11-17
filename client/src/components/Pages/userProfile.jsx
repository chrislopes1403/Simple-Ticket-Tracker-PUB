import React, { useState,useEffect } from 'react';
import { MDBCard, MDBCardBody  } from 'mdbreact';
import { MDBListGroup, MDBListGroupItem,  MDBBadge } from "mdbreact";
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";
import Card from 'react-bootstrap/Card';

import AllUserTickets from './ticketComponents/allUserTickets';
import AllUserProjects from './projectCompoents/allUserProjects';
const UserProfile = (props) => {

const [tab,setTab]= useState("1")
const [role,setRole]=useState("")


useEffect(() => {
  handleRole();
},[]);
  
  const handleTab =(tab)=>
  {
  setTab(tab)
  }

const handleRole=()=>
{
    if(props.premissions.userlvl==="admin")
    {
        setRole("Admin")
    } else if(props.premissions.userlvl==="teamlead")
    {
        setRole("Team Lead")
    } else if(props.premissions.userlvl==="dev")
    {
        setRole("Developer")
    }
} 

    return (
    
    <div className="row">
        <div className="col-3  p-0 m-0">
    <h2 className="section-heading mt-2">User: {props.premissions.username}</h2>
            
    <Card style={{ width: '15rem' }} className="card-panel-user">
                <Card.Body> 
                  <MDBCard  className="">
                      <img src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" className="avatar img-circle img-thumbnail" alt="avatar"/>
                      <MDBCardBody className="m-0 p-0"> 
                        <MDBContainer className="m-0 p-0">
                            <MDBListGroup className="m-0 p-0" >
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">{role}
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">Tickets<MDBBadge color="primary"
                                    pill>{props.ticketCount}</MDBBadge>
                                </MDBListGroupItem>
                                <MDBListGroupItem className="d-flex justify-content-between align-items-center">Projects<MDBBadge
                                    color="primary" pill>{props.projectCount}</MDBBadge>
                                </MDBListGroupItem>
                                
                                
                            </MDBListGroup>
                        </MDBContainer>
                      </MDBCardBody>
                  </MDBCard>
                </Card.Body>
            </Card>



        </div>
        <div className="col-9 p-0 m-0 ">
        <Card style={{ width: '49rem' }} className="card-panel-user-tabs">
                <Card.Body> 
                    <MDBContainer  className=" p-0 ">
                    <MDBNav className="nav-tabs">
                      <MDBNavItem>
                        <MDBNavLink link to="#" active={tab === "1"} onClick={()=>handleTab("1")} role="tab" >
                          Tickets
                        </MDBNavLink>
                      </MDBNavItem>
                      <MDBNavItem>
                        <MDBNavLink link to="#" active={tab === "2"} onClick={()=>handleTab("2")} role="tab" >
                          Projects
                        </MDBNavLink>
                      </MDBNavItem>
                      
                    </MDBNav>
                    <MDBTabContent activeItem={tab} id="usertabs"  className="m-0 p-0">
                      <MDBTabPane tabId="1" role="tabpanel">
                        <div className="tableContainer">

                          <AllUserTickets userTicketData={props.userTicketData}  handleTicketPage={props.handleTicketPage} />
                            
                        </div>
                      </MDBTabPane>
                      <MDBTabPane tabId="2" role="tabpanel">
                      <div className="tableContainer">
                          <AllUserProjects userProjectData={props.userProjectData} handleProjectPage={props.handleProjectPage}/>
                        
                      </div>
                      
                      </MDBTabPane>
                    
                    </MDBTabContent>
                  </MDBContainer>
              </Card.Body>
            </Card>
              
        </div>
         

        </div>


  

    );
}
 
export default UserProfile;