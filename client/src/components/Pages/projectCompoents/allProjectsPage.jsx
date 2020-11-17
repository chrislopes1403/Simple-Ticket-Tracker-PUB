import React from 'react';
import { MDBDataTableV5 } from 'mdbreact';
import Card from 'react-bootstrap/Card';
export default function Basic(props) {

    const [loadingDone, setLaodingDone] = React.useState(false)

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
        label: 'Team Leader',
        field: 'teamLeader',
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
    
    var result = props.projectsData;
        
    result.results.projectList.map((item, i) => {
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
                title: item.projectTitle,
                projectid: item.projectID,
                dateCreated: now,
                teamLeader: item.teamLeader.user,
                dateCompleted: now2,
                details: <button className="btn btn-sm btn-primary details" onClick={()=>handleProject(item.projectID)}><p className="btn-text">Details</p></button>
            }
        )


    })
   
    setLaodingDone(true)
}


const handleProject=(id)=>
{
    props.handleProjectPage(id)
}





if(loadingDone)
{
    return  <Card style={{ width: '65rem', height:'35rem' }} className="card-panel">
                <Card.Body> 
                  <MDBDataTableV5   hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4} data={datatable} />
                </Card.Body>
            </Card>
}
else return <h1>Loading...</h1>



}