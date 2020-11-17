import React from 'react';

import TicketPage from '../Pages/ticketComponents/ticketPage';
import ProjectPage from '../Pages/projectCompoents/projectPage';
import AllProjectsPage from '../Pages/projectCompoents/allProjectsPage';
import AllTicketsPage from '../Pages/ticketComponents/allTicketsPage';
import ManagementPage from '../Pages/managment';
import UserProfile from '../Pages/userProfile';

  

const MainContent = (props) => {

  
let Pages=[
  <ManagementPage pagenumber={props.pagenumber} 
                  fidCount={props.fidCount} 
                  freeUsers={props.freeUsers} 
                  overdue={props.overdue}
                  handleTicketPage={props.handleTicketPage}
                  Logout={props.Logout}
                  />,

  <AllProjectsPage projectsData={props.projectsData} 
                    premissions={props.premissions}  
                    handleProjectPage={props.handleProjectPage}
                    Logout={props.Logout}
                    projectID={props.procID} />,

  <AllTicketsPage ticketsData={props.ticketsData} 
                  Logout={props.Logout}
                  handleTicketPage={props.handleTicketPage}/>,

  <UserProfile  premissions={props.premissions} 
                ticketCount={props.ticketCount} 
                projectCount={props.projectCount} 
                Logout={props.Logout}
                userTicketData={props.userTicketData} 
                userProjectData={props.userProjectData}
                handleLastPage={props.handleLastPage}  
                handleTicketPage={props.handleTicketPage}
                handleProjectPage={props.handleProjectPage}
                />,


  <TicketPage ticketID={props.ticID} 
              Logout={props.Logout}
              premissions={props.premissions} 
              handleLastPage={props.handleLastPage} /> ,
  
  <ProjectPage premissions={props.premissions}  
               projectID={props.procID}
               Logout={props.Logout} 
               premissions={props.premissions} 
               handleLastPage={props.handleLastPage}  
               handleTicketPage={props.handleTicketPage}/>

]

    return (
    <div>
        {Pages[props.pagenumber]}

    </div>
  );
}
 
export default MainContent;