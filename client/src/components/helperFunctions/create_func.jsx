

const addUser = async(u,p,l) => {

        var data=await fetch(`/api/addUser`,{
        method: 'POST', 
        credentials:'include',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify ({ "user": u ,"password": p,"lvl":l})
        })
        .then(response=>response.json())

        .then(response=>{return response})

         .catch(err=>{console.log(err)})

          if(data.success===true)
          {
            return true
          }
          else
          {
            return false
          }
          
    }


    
const CreateProjectBackEnd = async(t,d,tl,a) => {

  var data=await fetch(`/api/createProject`,{
  method: 'POST', 
  credentials:'include',
  mode: 'same-origin',
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  },
  body: JSON.stringify ({ "title": t ,"description": d, "teamlead": tl, "assigned": a})
  })
  .then(response=>response.json())

  .then(response=>{return response})

   .catch(err=>{console.log(err)})

    if(data.success===true)
    {
      return true
    }
    else
    {
      return false
    }
    
}

const CreateProject= async(t,d,tl,a) =>
{
 let success=await CreateProjectBackEnd(t,d,tl,a);
 return success;
}
 
export  {CreateProject, addUser};