import React from 'react';
import { MDBDataTableV5 } from 'mdbreact';

export default function Basic(props) {

    const [loadingDone, setLoadingDone] = React.useState(false)

    let rowlist=[
    ]


  const [datatable] = React.useState({
    columns: [
      {
        label: 'Title',
        field: 'title',
        width: 150,
        attributes: {
          'aria-controls': 'DataTable',
          'aria-label': 'Title',
        },
      },
      {
        label: 'Project ID',
        field: 'projectid',
        width: 470,
      },
     
      {
        label: 'Date Created',
        field: 'dateCreated',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Fidelity',
        field: 'fidelity',
        sort: 'disabled',
        width: 150,
      },
      {
        label: 'Date Completed',
        field: 'dateCompleted',
        sort: 'disabled',
        width: 100,
      },
      {
        label: 'Details',
        field: 'details',
        sort: 'disabled',
        width: 100,
      }
    ],
    rows: 
         
            
            rowlist
            
     
    ,
  });


React.useEffect(() => {
handleData();
    },[]);

const handleData=()=>
{
    var result = props.userTicketData;

    result.map((item, i) => {
        var now = item.dateCreated
        now= now.toString().substr(0, now.toString().indexOf(' GMT'))

        var now2 
        if(item.dateCompleted!=="")
        {
          now2 = item.dateCompleted;
          now2= now2.toString().substr(0, now2.toString().indexOf(' GMT'))
        }
        else
        {
            now2="N/A"
        }


        rowlist.push(
            {
                title: item.ticketTitle,
                projectid: item.assignedProjectID,
                dateCreated: now,
                fidelity: item.fidelity,
                dateCompleted: now2,
                details: <button className="btn btn-sm btn-primary details" onClick={()=>handleTicket(item.ticketID)}><p className="btn-text">Details</p></button>
            }
        )


    })
   
    setLoadingDone(true)
}


const handleTicket=(id)=>
{
    props.handleTicketPage(id)
}





if(loadingDone)
{
    return   <MDBDataTableV5 hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datatable} />;
}
else return <h1>Loading...</h1>



}