import {allTicketDataBackEnd} from '../helperFunctions/TicketData_func';
const allProjectDataBackEnd = async() => {

    var data=await fetch(`/api/allProjectTableData`,{
        method: 'POST', 
        credentials:'include',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        })
        .then(response=>response.json())
        .then(response=>{return response})
    
        .catch(err=>{console.log(err)})

        return data
}


const userProjects =async(username)=>
{
  var userdata= await  allProjectDataBackEnd();
  const results= userdata.results.projectList.filter(item=> (item.assignedUsers.find(element => element.user===username)!=null) );
  return results;      
}


const userProjectCount =async(username)=>
{
    
  var userdata= await  allProjectDataBackEnd();
  var results=0;
   userdata.results.projectList.map((item,i )=>{
    
    if(item.assignedUsers.find(element => element.user===username)!=null)
    {
        results++;
    }
    
   });
   return results;
}



const ProjectData =async(projectID)=>
{
    
  var userdata= await allProjectDataBackEnd();
  var result=userdata.results.projectList.find(item=>item.projectID===projectID)
  return result;
}


const MakeAProjectComment = async(u,c,l,i) => {

    await fetch(`/api/makeProjectComment`,{
        method: 'POST', 
        credentials:'include',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify ({ "user": u ,"comment": c,"userlvl":l,"id":i})
        })
        .then(response=>response.json())
        .then(response=>{return response})
    
        .catch(err=>{console.log(err)})
  
  }

  const MakeAProjectEdit = async(t,d,i) => {

    await fetch(`/api/updateProject`,{
        method: 'POST', 
        credentials:'include',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify ({ "title": t,"description": d,"id":i})
        })
        .then(response=>response.json())
        .then(response=>{return response})
    
        .catch(err=>{console.log(err)})
  
  }

  const ProjectTicketsCall =async(id)=>
  {
    var projectdata= await allTicketDataBackEnd();
    const results= projectdata.results.ticketList.filter(item=> item.assignedProjectID === id );
 return results  
  }



  const CompleteProject = async(id) => {

    await fetch(`/api/completeProject`,{
        method: 'POST', 
        credentials:'include',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify ({"id":id})
        })
        .then(response=>response.json())
        .then(response=>{return response})
    
        .catch(err=>{console.log(err)})
  
  }




export  {userProjects,userProjectCount,ProjectData,MakeAProjectComment,MakeAProjectEdit
  ,allProjectDataBackEnd,ProjectTicketsCall,CompleteProject};