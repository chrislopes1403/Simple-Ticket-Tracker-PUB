const allTicketDataBackEnd = async() => {

    var data=await fetch(`/api/allTicketTableData`,{
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

        return data;
}


const userTickets =async(username)=>
{
  var userdata= await allTicketDataBackEnd();
  const results= userdata.results.ticketList.filter(item=> (item.assignedUsers.find(element => element.user===username)!=null));
return results;     
}


const userTicketCount =async(username)=>
{
    
  var userdata= await  allTicketDataBackEnd();
  var results=0;
   userdata.results.ticketList.map((item,i )=>{
    
    if(item.assignedUsers.find(element => element.user===username)!=null)
    {
        results++;
    }
    
   });
   return results;
}

const TicketData =async(ticketID)=>
{
    
  var userdata= await allTicketDataBackEnd();
  var result=userdata.results.ticketList.find(item=>item.ticketID===ticketID)
  return result;
}


const MakeATicketComment = async(u,c,l,i) => {

  await fetch(`/api/makeTicketComment `,{
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



const MakeATicketEdit = async(t,d,f,i) => {

  await fetch(`/api/updateTicket`,{
      method: 'POST', 
      credentials:'include',
      mode: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify ({ "title": t,"description": d,"fidelity":f,"id":i})
      })
      .then(response=>response.json())
      .then(response=>{return response})
  
      .catch(err=>{console.log(err)})

}

const MakeATicketFromProject = async(t,d,f,i) => {

  await fetch(`/api/makeTicketFromProject `,{
      method: 'POST', 
      credentials:'include',
      mode: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify ({ "title": t,"description": d,"fidelity":f,"id":i})
      })
      .then(response=>response.json())
      .then(response=>{return response})
  
      .catch(err=>{console.log(err)})

}

const TicketFidelityCount = async() => {

  var fid= await allTicketDataBackEnd();

  var fidlist=[3];
  fidlist[0]=0;
  fidlist[1]=0;
  fidlist[2]=0;


  
 fid.results.ticketList.map((item,i)=>{

    if(item.fidelity==="high")
      {fidlist[0]++;}

    if(item.fidelity==="med")
      {fidlist[1]++;}

    if(item.fidelity==="low")
     {fidlist[2]++;}

 })

return fidlist
}


const OverdueTickets = async()=>
{
 const overdue = await allTicketDataBackEnd();
 var result = overdue.results.ticketList.filter(item=>item.fidelity ==="high");
 return result;
}


const CompleteTicket = async(id) => {

  await fetch(`/api/completeTicket`,{
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

export {userTickets,userTicketCount,TicketData,MakeATicketComment,MakeATicketEdit,
  allTicketDataBackEnd,MakeATicketFromProject,TicketFidelityCount,OverdueTickets,CompleteTicket};