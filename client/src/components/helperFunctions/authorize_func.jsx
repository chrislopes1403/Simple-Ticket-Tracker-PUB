const authorizeUser = async() => {
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
     return data.success
      
}
const handleLogout = async() => {
    await fetch(`/api/Logout`,{
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
    
      
}

export  {authorizeUser,handleLogout};