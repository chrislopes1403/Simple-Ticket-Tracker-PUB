const userPremissions = async() => {
    var data=await fetch(`/api/authorize`,{
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
     

     var obj ={
         username:data.user,
         userlvl:data.userlvl
     }

     return obj
      
}


export default userPremissions;