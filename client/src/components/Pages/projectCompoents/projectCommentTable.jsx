import React from 'react';
import { MDBDataTableV5 } from 'mdbreact';

export default function Basic(props) {

    const [datarow, setDataRow] = React.useState(null)
    const [loadingDone, setLaodingDone] = React.useState(false)

    let rowlist=[
    ]


  const [datatable, setDatatable] = React.useState({
    columns: [
      {
        label: 'User',
        field: 'user',
        width: 150,
        attributes: {
          'aria-controls': 'DataTable',
          'aria-label': 'user',
        },
      },
      {
        label: 'Comment',
        field: 'comment',
        width: 600,
      },
      {
        label: 'Role',
        field: 'role',
        width: 100,
      },
     
      {
        label: 'Date Created',
        field: 'dateCreated',
        sort: 'asc',
        width: 100,
      },
     
    ],
    rows: 
         
            
            rowlist
            
     
    ,
  });


React.useEffect(() => {

handleData()
    },[]);

const handleData=async()=>
{
    
    
    props.comments.map((item,i)=>{
     
       
            var now = item.date
            now= now.toString().substr(0, now.toString().indexOf(' GMT'))
            rowlist.push(
                {
                    user: item.user,
                    comment: item.comment,
                    role:item.userlvl,
                    dateCreated: now          
                })
      
      

    })
       

   
    setLaodingDone(true)
}




if(loadingDone)
{
    return   <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datatable} />;
}
else return <h1>Loading...</h1>



}