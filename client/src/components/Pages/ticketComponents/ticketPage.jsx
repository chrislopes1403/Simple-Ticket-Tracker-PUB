import React, { useState,useEffect } from 'react';
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";
import {  MDBBtn } from 'mdbreact';

import { MDBListGroup, MDBListGroupItem, MDBBadge } from "mdbreact";
import TicketCommentTable from './ticketCommentsTable';
import{TicketData,MakeATicketComment,MakeATicketEdit,CompleteTicket} from '../../helperFunctions/TicketData_func';
import Card from 'react-bootstrap/Card';
import $ from "jquery";
import SpinnerPage from "./../../SpinnerPage";
import {authorizeUser} from "./../../helperFunctions/authorize_func";

const TicketPage = (props) => {

    const [tab,setTab]= useState("1")
    const [tab2,setTab2]= useState("1")
    const [disabledTab,setDisableTab]= useState(true)

    const [loading, setLoading] =useState(true)
    const [ticketData, setTicketData] =useState(null)


   const handleTab =(tab)=> {setTab(tab)}
   const handleTab2 =(tab2)=> {setTab2(tab2)}
  

    const handleData= async()=>
    {
        if(await authorizeUser())
        {
        var result= await TicketData(props.ticketID);
        setTicketData(result);
       
        setLoading(false);
        }
        else
        {
            props.Logout();
        }
    }



    const handleDisable= ()=>
    {
        if(props.premissions.userlvl==="admin")
        {
            setDisableTab(false)
        }
        
    }

    const handleComment=async()=>
    {
        var comment=document.getElementById('comment-body').value;
        if(comment==="")
        {

            showAndDismissAlert('danger', 'Comment Not Created! All Fields Not Filled!' );
            return;
        }
       await MakeATicketComment(props.premissions.username,comment,props.premissions.userlvl,props.ticketID);
       document.getElementById('comment-body').value="";
       showAndDismissAlert('success', 'Comment Made!' );

    }

    const handleCommentClose = () =>
    {
        handleComment();
    }

    const handleEdit=async()=>
    {
        var title=document.getElementById('title-body').value;
        var description=document.getElementById('description-body').value;
        var fidelity=document.getElementById('fidelity-body').value;


        if(title==="" && description==="" && fidelity==="" )
        {
            showAndDismissAlert('danger', 'Ticket Not Edited! All Fields Not Filled!' );
            return;
        }
       await MakeATicketEdit(title,description,fidelity,props.ticketID);
        document.getElementById('title-body').value="";
        document.getElementById('description-body').value="";
        document.getElementById('fidelity-body').value="";
        showAndDismissAlert('success', 'Edit Made!' );
        
    }
        
    const handleEditClose=()=>
    {
        handleEdit();
    }

    const handleBack=()=>{props.handleLastPage()}


   

    const showAndDismissAlert=(type, message)=> {
        var htmlAlert = '<div class="alert alert-' + type + '">' + message + '</div>';

        $(".alert-messages").prepend(htmlAlert);
    
        $(".alert-messages .alert").first().hide().fadeIn(200).delay(2000).fadeOut(1000, function () { $(this).remove(); });
      }


      const handleCompleted=()=>{
          
        CompleteTicket(props.ticketID);
        showAndDismissAlert('success', 'Ticket Completed!' );
      }



   useEffect(() => 
   {

    handleData();
   handleDisable();
    },[]);


    return loading ? <SpinnerPage/>:( 
            <div className="row">
                <div className="col-6">
                  <Card style={{ width: '33rem' }} className="card-panel">
                        <Card.Body >
                            <h4 className="mt-3">Title: {ticketData.ticketTitle}</h4>
                            <h4 className="">Ticket ID: {ticketData.ticketID}</h4>
                            <h4 className="">Project ID: {ticketData.assignedProjectID} </h4>
                            <h4 className="">Fidelity: {ticketData.fidelity}</h4>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '33rem' }} className="card-panel-ticket-body-left mt-4">
                        <Card.Body >

                        <MDBContainer className=" p-0 ">
                                    <MDBNav className="nav-tabs ">
                                    <MDBNavItem>
                                        <MDBNavLink link to="#"active={tab === "1"} onClick={()=>handleTab("1")} role="tab" >
                                        Description
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab === "2"} onClick={()=>handleTab("2")} role="tab" >
                                    Assigned Users
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab === "3"} onClick={()=>handleTab("3")}role="tab" >
                                        Comments
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    </MDBNav>
                                    <MDBTabContent activeItem={tab} className="m-0 p-0"  >
                                    <MDBTabPane tabId="1" role="tabpanel">
                                        {ticketData.ticketDescription}

                                    </MDBTabPane>
                                    <MDBTabPane tabId="2" role="tabpanel">

                                    <MDBContainer className="mr-5">
                                        <MDBListGroup style={{ width: "15rem" }}>
                                            {
                                            
                                            ticketData.assignedUsers.map((item,i)=>{

                                            var role;

                                            if(item.userlvl==="admin")
                                            {
                                                role="Admin"
                                            }else if(item.userlvl==="teamleader")
                                            {
                                                role="Team Leader"
                                            }else if(item.userlvl==="dev")
                                            {
                                                role="Developer"
                                            }



                                                return <MDBListGroupItem key={i} style={{ color: 'black' }} className="d-flex justify-content-between align-items-center">{item.user}<MDBBadge color="primary"
                                            pill>{role}</MDBBadge>
                                                        </MDBListGroupItem>
                                            })}

                                        </MDBListGroup>
                                    </MDBContainer>

                                    </MDBTabPane>
                                    <MDBTabPane tabId="3" role="tabpanel">
                                    <TicketCommentTable comments={ticketData.ticketComments} username={props.premissions.username}/>
                                    </MDBTabPane>
                                    </MDBTabContent>
                                </MDBContainer>

                        </Card.Body>
                    </Card>
                </div>
                <div className="col-6">
                <Card style={{ width: '30rem', height:'25rem' }} className="card-panel-ticket-body-right">
                    <Card.Body style={{ position: 'relative' }} >

                                <MDBContainer className=" p-0 ">
                                <MDBNav className="nav-tabs ">
                                <MDBNavItem>
                                    <MDBNavLink link to="#"active={tab2 === "1"} onClick={()=>handleTab2("1")} role="tab" >
                                    Comment
                                    </MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                    <MDBNavLink id="link1" link to="#" active={tab2 === "2"} onClick={()=>handleTab2("2")} role="tab" disabled={disabledTab} >
                                    Edit
                                    </MDBNavLink>
                                </MDBNavItem>
                                <MDBNavItem>
                                    <MDBNavLink id="link1" link to="#" active={tab2 === "3"} onClick={()=>handleTab2("3")} role="tab" disabled={disabledTab} >
                                    Complete Edit
                                    </MDBNavLink>
                                </MDBNavItem>
                                </MDBNav>
                                <MDBTabContent activeItem={tab2} className="m-0 p-0"  >
                                <MDBTabPane tabId="1" role="tabpanel">
                                    <h3>Comment:</h3>
                                    <input className="des-body " id="comment-body"  placeholder="Comment" type="text"/>
                                    <MDBBtn color="primary"  onClick={handleCommentClose}>Commit Comment</MDBBtn>
                                </MDBTabPane>
                                <MDBTabPane tabId="2" role="tabpanel">
                                <h3>Edit:</h3>

                                <input className="des-body mt-2" id="title-body" placeholder="Title"></input>
                                <input className="des-body mt-2" id="description-body"placeholder="Description"></input>
                                <input className="des-body mt-2" id="fidelity-body"placeholder="Fidelity"></input>
                                <MDBBtn className="mt-2" color="primary" onClick={handleEditClose}>Commit Edit</MDBBtn>

                                </MDBTabPane>
                                <MDBTabPane tabId="3" role="tabpanel">
                                <h3>Completed Ticket:</h3>
                                <button type="button"  className="btn btn-primary  mt-1 btn-commit"onClick={handleCompleted} >Completed</button>

                                </MDBTabPane>
                                </MDBTabContent>
                            </MDBContainer>





                            <button  style={{ position: 'absolute',bottom: '5px'}}type="button"  className="btn btn-primary  mt-1 btn-commit" onClick={handleBack}>Back</button>



                    </Card.Body>
                </Card>
                </div>
                
                <div className="alert-messages text-center">
        </div>
            </div>
     );
}
 
export default TicketPage;

