const FreeUsersBackEnd = async() => {

    var data=await fetch(`/api/FreeUsers`,{
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


const FreeUsers =async()=>
{
    var users = await FreeUsersBackEnd();
    return users;
}


export  {FreeUsers};