import React, { useState,useEffect } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { MDBContainer} from 'mdbreact';
import Card from 'react-bootstrap/Card';
import {CreateProject,addUser} from "./../helperFunctions/create_func";
import OverdueTickets from "./overdueTickets";
import $ from "jquery";
const ManagementPage = (props) => {
    const [show, setShow] = useState(true);
    
    const [lead,setLead]= useState([]);
    const [select,setSelect]= useState(false);
    const [select2,setSelect2]= useState(false);
    const [developer,setDeveloper]= useState([]);
    const [selectedLead,setSelectedLead]= useState(null);
    const [selectedDeveloper,setSelectedDeveloper]= useState([]);
    const [usersList,setUsersList]= useState(props.freeUsers);
    const [x,setX]= useState(props.fidCount[0]);
    const [y,setY]= useState(props.fidCount[1]);
    const [z,setZ]= useState(props.fidCount[2]);



    const [chartData,setChart]= useState({
        dataHorizontal: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [
              {
                label: '% Ticket Fidelity',
                data: [x, y, z],
                fill: false,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)'
                 
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)'
                
                ],
                borderWidth: 1
              }
            ]
          }
      });
   
   
      
    const handleData= ()=>
    {
        props.freeUsers.users.map((item,i)=>{
            if(item.userlvl==="admin"|| item.userlvl==="teamlead")
            {
                setLead(lead=>[...lead,item.user])
            }
            else
            {
                setDeveloper(developer=>[...developer,item.user])
            }
        })
    }




      const handleTeamLead =()=>
      {
          if(select===true)
          {
          var teamleads= document.getElementById('team-lead').value;          
          setSelectedLead(teamleads);
         
          }
          setSelect(!select)
      }

      const handleDeveloper =()=>
      {
          if(select2===true)
          {
          var devs= document.getElementById('developer').value;
            if(!selectedDeveloper.includes(devs))
                setSelectedDeveloper(selectedDeveloper=>[...selectedDeveloper,devs])
          }
          setSelect2(!select2)
      }

      const handleSubmit = async() =>
      {
            var title= document.getElementById('title').value;
            var description=document.getElementById('description').value;
            var assigned = usersList.users.filter(element => selectedDeveloper.includes(element.user) ||  element.user === selectedLead )
            var lead =assigned.find(element => element.user === selectedLead )  
            
            console.log(title)
            if(title==="" || description==="" || assigned==="" || lead=== "")
            {
                showAndDismissAlert('danger', 'Project Not Created! All Fields Not Filled!' );
                handleClearProject(); 
                return;
            }

           var success=  await CreateProject(title,description,lead,assigned);      
           

              
           if(success){
           showAndDismissAlert('success', 'Project Created! ');
           handleClearProject(); 
            }
            else
            showAndDismissAlert('danger', 'Project Not Created!' );

      }



      const handleClearProject =async() =>
      {
        document.getElementById('title').value="";
        document.getElementById('description').value="";
        setSelectedLead(null);
        setSelectedDeveloper([]);
      }


      const handleAddUser = async() =>
      {
            var username= document.getElementById('username').value;
            var password=document.getElementById('password').value;
            var level=document.getElementById('level').value;
            

            if(username==="" || password==="" || level==="" )
            {
                showAndDismissAlert('danger', 'User Not Added! All Fields Not Filled!' );
                handleClearProject(); 
                return;
            }



            var result=await addUser(username,password,level);
           document.getElementById('username').value="";
           document.getElementById('password').value="";
           document.getElementById('level').value="";
           
           if(result)
           showAndDismissAlert('success', 'User '+username+' Added! ')
            else
            showAndDismissAlert('danger', 'User '+username+'  Not Added! ') 
        }


  
      useEffect(() => {
        handleData();
          },[]);







          const showAndDismissAlert=(type, message)=> {
            var htmlAlert = '<div class="alert alert-' + type + '">' + message + '</div>';

            $(".alert-messages").prepend(htmlAlert);
        
            $(".alert-messages .alert").first().hide().fadeIn(200).delay(2000).fadeOut(1000, function () { $(this).remove(); });
          }












    return  (
    <div>
    <div className="row">
            <div className="col-6">
            <Card style={{ width: '30rem' }} className="card-panel">
                <Card.Body>
                    <MDBContainer>
                        <h3 className='mt-5'>Fidelity Count</h3>
                        <HorizontalBar
                        className="chart-data"
                        data={chartData.dataHorizontal}
                        options={{ responsive: true }}
                        />
                    </MDBContainer>

                </Card.Body>
            </Card>
            <Card style={{ width: '30rem', height: '19rem' }} className="card-panel mt-2">
                <Card.Body>
                <h3 className=''>Add User</h3>
                <label  className="grey-text font-weight-light" >
                Username
                </label>
                <input type="text"  className="form-control " id="username"/>
                <label  className="grey-text font-weight-light" >
                Password
                </label>
                <input type="text"  className="form-control " id="password"/>
                <label  className="grey-text font-weight-light" >
                Authorization:( Enter: "admin", "teamlead" or "dev" )
                </label>
                <input type="text"  className="form-control " id="level"/>
                <button  onClick={()=>handleAddUser()} className="btn btn-primary mt-2">Add</button>
                </Card.Body>
            </Card>
            </div>
            <div className="col-6">
            <Card style={{ width: '25rem' }} className="card-panel">
                <Card.Body >
                
                            <div >
                                    <p className="h4 text-center py-4">New Project</p>
                                    <label  className="grey-text font-weight-light" >
                                    Title
                                    </label>
                                    <input type="text"  className="form-control " id="title"/>
                                    <label className="grey-text font-weight-light">
                                    Description
                                    </label>
                                    <input type="text" className="form-control" id ="description"/>
                                    <label className="grey-text font-weight-light">
                                    Assign Users
                                    </label>
                                    <div className="">
                                   

                                    <div>
                                        <select className="browser-default custom-select" id="team-lead"  onClick={()=>handleTeamLead()}>
                                            {lead.map((item,i)=>{
                                                return <option key={i} value={item}>{item}</option>
                                            })}
                                        </select>
                                    </div>
                                    <p>Team Lead:  {selectedLead} </p>
                                    
                                    <div>
                                        <select className="browser-default custom-select" id="developer"  onClick={()=>handleDeveloper()} >
                                            {developer.map((item,i)=>{
                                                return <option key={i} value={item}>{item}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="added-Users">
                                        <p>Developers: {selectedDeveloper.join(' ')}</p>
                                    
                                    </div>  
                                    </div>
                                    <button  onClick={()=>handleSubmit()} className="btn btn-primary mr-3">Submit</button>
                                    <button  onClick={()=>handleClearProject()} className="btn btn-danger">Clear</button>
                                </div>

                            </Card.Body>
                        </Card>
             
            </div>
        </div>
        <div className="row">
        <div className="col-6">
            <Card style={{ width: '44rem' }} className="card-panel mt-2">
                <Card.Body>
                <h3 className='mt-5'>High Fidelity Tickets</h3>
                   <OverdueTickets   className="overdue-card" overdue={props.overdue} handleTicketPage={props.handleTicketPage}/>
                </Card.Body>
            </Card>
        </div>
        </div>
  
        <div className="alert-messages text-center">
        </div>

    </div>
  );
}
 



export default ManagementPage;

