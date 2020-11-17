import React, { useState,useEffect } from 'react';
import { MDBContainer, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";

import { MDBListGroup, MDBListGroupItem, MDBBadge } from "mdbreact";

import {userProjects,userProjectCount,ProjectData,MakeAProjectComment,MakeAProjectEdit,CompleteProject} from '../../helperFunctions/ProjectData_func';
import {MakeATicketFromProject} from '../../helperFunctions/TicketData_func';
import ProjectCommentTable from './projectCommentTable';
import ProjectTickets from './ProjectTickets'; 
import Card from 'react-bootstrap/Card';
import SpinnerPage from "./../../SpinnerPage";
import $ from "jquery";
import { Redirect} from 'react-router-dom';
import {authorizeUser} from "./../../helperFunctions/authorize_func";


const ProjectPage = (props) => {

    const [tab,setTab]= useState("1")
    const [tab2,setTab2]= useState("1")
    const [disabledTab,setDisableTab]= useState(true)

   
    const [loading, setLoading] =useState(true)
    const [projectData, setProjectData] =useState(null)


   const handleTab =(tab)=> {setTab(tab)}
   const handleTab2 =(tab2)=> {setTab2(tab2)}
   
    

   useEffect(() => 
   {
    handleData();
    
    },[]);


    const handleDisable= ()=>
    {
        if(props.premissions.userlvl==="admin")
        {
            setDisableTab(false)
        }
        
    }





    const handleData= async()=>
    {
        var result;
        if(await authorizeUser())
        {
        result= await ProjectData(props.projectID);
        setProjectData(result);
        setLoading(false) ;   
        handleDisable();
        }
        else
        {
            props.Logout();

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
         await  MakeAProjectComment(props.premissions.username,comment,props.premissions.userlvl,props.projectID);
        document.getElementById('comment-body').value="";

        showAndDismissAlert('success', 'Comment Made!' );
      

    }

  

    const handleEdit= async()=>
    {
        var title=document.getElementById('title-body').value;
        var description=document.getElementById('description-body').value;
        document.getElementById('description-body').value="";
        document.getElementById('title-body').value="";    
        
        if(title==="" && description==="")
        {
            showAndDismissAlert('danger', 'Project Not Edited! All Fields Not Filled!' );
            return;
        }
        await MakeAProjectEdit(title,description,props.projectID); 
       
        showAndDismissAlert('success', 'Project Edit Made!' );


    }
        
   

    const handleTicket=async()=>
    {
        var title=document.getElementById('title-body2').value;
        var description=document.getElementById('description-body2').value;
        var fidelity=document.getElementById('fidelity-body2').value;
       
        if(title==="" || description===""|| fidelity==="" )
        {
            showAndDismissAlert('danger', 'Ticket Not Created! All Fields Not Filled!' );
            return;
        }
        await  MakeATicketFromProject(title,description,fidelity,props.projectID);
        


        document.getElementById('title-body2').value="";
        document.getElementById('description-body2').value="";
        document.getElementById('fidelity-body2').value="";

        showAndDismissAlert('success', 'Ticket Made!' );

    }
        
    





    const showAndDismissAlert=(type, message)=> {
        var htmlAlert = '<div class="alert alert-' + type + '">' + message + '</div>';

        $(".alert-messages").prepend(htmlAlert);
    
        $(".alert-messages .alert").first().hide().fadeIn(200).delay(2000).fadeOut(1000, function () { $(this).remove(); });
      }


      const handleCompleted=()=>{
          
        CompleteProject(props.projectID);
        showAndDismissAlert('success', 'Project Completed!' );
      }





    const handleBack=()=>{props.handleLastPage()}

   
    return loading ? <SpinnerPage/> :( 
            <div className="row">
                
                <div className="col-6">

                    <Card style={{ width: '33rem' }} className="card-panel">
                        <Card.Body >
                            <h4 className="mt-3">Title: {projectData.projectTitle}</h4>
                            <h4 className="">Project ID: {projectData.projectID} </h4>
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
                                        <MDBNavLink link to="#" active={tab === "2"} onClick={()=>handleTab("2")} role="tab"   >
                                    Assigned Users
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab === "3"} onClick={()=>handleTab("3")}role="tab" >
                                        Comments
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab === "4"} onClick={()=>handleTab("4")}role="tab"  >
                                        Tickets
                                        </MDBNavLink>
                                    </MDBNavItem>

                                    </MDBNav>
                                    <MDBTabContent activeItem={tab} className="m-0 p-0"  >
                                    <MDBTabPane tabId="1" role="tabpanel">
                                    <p>{projectData.projectDescription}</p>

                                    </MDBTabPane>
                                    <MDBTabPane tabId="2" role="tabpanel">

                                    <MDBContainer className="mr-5">
                                        <MDBListGroup style={{ width: "15rem" }}>
                                        {projectData.assignedUsers.map((item,i)=>{

                                            var role;

                                            if(item.userlvl=="admin")
                                            {
                                                role="Admin"
                                            }else if(item.userlvl=="teamlead")
                                            {
                                                role="Team Leader"
                                            }else if(item.userlvl=="dev")
                                            {
                                                role="Developer"
                                            }



                                                return <MDBListGroupItem style={{ color: 'black' }}   key = {i} className="d-flex justify-content-between align-items-center">{item.user}<MDBBadge color="primary"
                                                        pill>{role}</MDBBadge>
                                                        </MDBListGroupItem>
                                            })}

                                        </MDBListGroup>
                                    </MDBContainer>

                                    </MDBTabPane>
                                    <MDBTabPane tabId="3" role="tabpanel"  className="scrollbar scrollbar-night-fade">
                                         <ProjectCommentTable   className="scrollbar scrollbar-night-fade" comments={projectData.projectComments} username={props.premissions.username}/>
                                    </MDBTabPane>
                                    
                                    <MDBTabPane tabId="4" role="tabpanel"  className="scrollbar scrollbar-night-fade">

                                        <ProjectTickets Logout={props.Logout}  className="scrollbar scrollbar-night-fade" id={projectData.projectID} handleTicketPage={props.handleTicketPage}/>


                                    </MDBTabPane>
                                    </MDBTabContent>
                                </MDBContainer>

                        </Card.Body>
                    </Card>
                </div>
                <div className="col-6">
                <Card style={{ width: '30rem', height:'25rem' }} className="card-panel">
                    <Card.Body style={{ position: 'relative' }} >
                    <MDBNav className="nav-tabs ">
                                    <MDBNavItem>
                                        <MDBNavLink link to="#"active={tab2 === "1"} onClick={()=>handleTab2("1")} role="tab" id="tab-1" >
                                       Comment
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab2 === "2"} onClick={()=>handleTab2("2")} role="tab" id="tab-2" disabled={disabledTab}  >
                                        Edit
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab2 === "3"} onClick={()=>handleTab2("3")}role="tab" id="tab-3"  disabled={disabledTab}   >
                                        Make A Ticket
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink link to="#" active={tab2 === "4"} onClick={()=>handleTab2("4")}role="tab" id="tab-4"  disabled={disabledTab}  >
                                         Mark Commpleted 
                                        </MDBNavLink>
                                    </MDBNavItem>
                                    </MDBNav>
                                    <MDBTabContent activeItem={tab2} className="m-0 p-0"  >
                                    <MDBTabPane tabId="1" role="tabpanel">
                                    <h3>Comment:</h3>
                                    <input className="des-body " id="comment-body" placeholder="Comment" type="text"/>
                                    <button type="button"  className="btn btn-primary  mt-1 btn-commit" onClick={handleComment}>Make A Comment</button>

                                    </MDBTabPane>
                                    <MDBTabPane tabId="2" role="tabpanel">
                                    <h3>Edit:</h3>

                                    <input className="des-body mt-2" id="title-body" placeholder="Title"></input>
                                    <input className="des-body mt-2" id="description-body"placeholder="Description"></input>
                                    <button type="button"  className="btn btn-primary  mt-1 btn-commit" onClick={handleEdit}>Edit Project</button>

                                    </MDBTabPane>
                                    <MDBTabPane tabId="3" role="tabpanel">
                                    <h3>Ticket:</h3>

                                    <input className="des-body mt-2" id="title-body2" placeholder="Title"></input>
                                    <input className="des-body mt-2" id="description-body2"placeholder="Description"></input>
                                    <input className="des-body mt-2" id="fidelity-body2"placeholder="Fidelity select: (low) (med) (high) "></input>
                                    <button type="button"  className="btn btn-primary  mt-1 btn-commit"onClick={handleTicket} >Make A Ticket</button>

                                    </MDBTabPane>
                                    <MDBTabPane tabId="4" role="tabpanel">
                                    <h3>Mark Project As Completed:</h3>

                                    
                                    <button type="button"  className="btn btn-primary  mt-1 btn-commit"onClick={handleCompleted} >Completed</button>

                                    </MDBTabPane>
                                  
                                    </MDBTabContent>
                                    <button style={{ position: 'absolute',bottom: '5px'}} type="button"  className="btn btn-primary  mt-1 btn-commit" onClick={handleBack}>Back</button>
                        </Card.Body>
                    </Card>
                </div>

                <div className="alert-messages text-center">
        </div>
                   
            </div>
     );

    
 
}
 
export default ProjectPage;
