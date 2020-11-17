import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import MainContent from "./MainContent";
import 'bootstrap/dist/css/bootstrap.css';
import userPremissions from '../helperFunctions/userPremissions_func';
import SpinnerPage from './../SpinnerPage';
import {userTicketCount,allTicketDataBackEnd,userTickets,TicketFidelityCount,OverdueTickets} from '../helperFunctions/TicketData_func';
import {userProjectCount,allProjectDataBackEnd,userProjects} from '../helperFunctions/ProjectData_func';
import {FreeUsers} from "../helperFunctions/userAvailability_func"; 
import {
  Redirect
} from 'react-router-dom';
const Dashboard = (props) => {
   


//----------------------------------------------------------------------
const [premissions,setPremissions]= useState(null);  
const [loadingDone,setLoadingDone]= useState(false); 
const[pagenumber,setPageNumber] = useState(0);
const[lastpage,setLastPage] = useState(0);
const[ticketCount,setTicketCount] = useState(0);
const[projectCount,setProjectCount] = useState(0);
const[ticID,setTicID] = useState(0);
const[procID,setProcID] = useState(0);
const [projectsData,setProjectsData]= useState(null);
const [ticketsData,setTicketsData]= useState(null);
const [userTicketData,setUserTicketData]= useState(null); 
const [userProjectData,setUserProjectData]= useState(null); 
const [fidCount,setFidCount]= useState(null);   
const [freeUsers,setFreeUsers]= useState(null);
const [overdue,setOverdue]= useState(null);   

//---------------------------------------------------------------

useEffect(() => {
  getData();
  setPageNumber(0);
},[]);
const getData=async()=>
{
  if(await props.authorizeUser())
  {
  var premish= await userPremissions();
  var ticketcount = await userTicketCount(premish.username);
  var projectcount = await userProjectCount(premish.username);
  var pdata = await allProjectDataBackEnd();
  var tdata = await allTicketDataBackEnd();
  var tuser = await userTickets(premish.username);
  var puser = await userProjects(premish.username);
  var fid = await TicketFidelityCount();
  var fusers = await FreeUsers();
  var overdues = await OverdueTickets();


  setOverdue(overdues);
  setTicketCount(ticketcount);
  setProjectCount(projectcount);
  setPremissions(premish);
  setProjectsData(pdata);
  setTicketsData(tdata);
  setUserProjectData(puser);
  setUserTicketData(tuser);
  setFreeUsers(fusers);
  setFidCount(fid);

  if(premish.userlvl !=='admin')
    setPageNumber(1);
  

  setLoadingDone(true);
  }
  else
  {
    const { from2 } =  { from2: { pathname: '/login' } }
    return <Redirect to={from2} />

  }
}




const handlePage=(page)=>
{
  
setPageNumber(page);
}


const handleTicketPage=(id)=>
{
setTicID(id)
setLastPage(pagenumber)
setPageNumber(4)
}

const handleLastPage=()=>
{
  setPageNumber(lastpage);
}


const handleProjectPage=(id)=>
{
setProcID(id)
setLastPage(pagenumber)
setPageNumber(5)
}



return loadingDone ? ( 
  <div>
  <NavBar Logout={props.Logout}/>
   <div className="scrollbar scrollbar-night-fade main-content">

      <SideBar  premissions={premissions} handlePage={handlePage} />
      <MainContent premissions={premissions} 
                    ticketCount={ticketCount}
                    projectCount={projectCount}
                    projectsData={projectsData}
                    ticketsData={ticketsData}
                    userTicketData={userTicketData}
                    userProjectData={userProjectData}
                    pagenumber={pagenumber}
                    fidCount={fidCount}
                    freeUsers={freeUsers}
                    overdue={overdue}
                    ticID={ticID}
                    procID={procID}
                    handleTicketPage={handleTicketPage}
                    handleLastPage={handleLastPage}
                    handleProjectPage={handleProjectPage}
                    Logout={props.Logout}

                  
      />
      </div>
  </div>

  ): <SpinnerPage/>
}



export default Dashboard;