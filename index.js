const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
var router = express.Router();

const bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
var crypto = require('crypto');

const {MongoClient} = require('mongodb');


const uri = "mongodb+srv://Chris:lJk7aA7UQZg8vrwF@cluster0.toq40.mongodb.net/<dbname>?retryWrites=true&w=majority";
app.use(cookieParser('13155e76fd8f87854073b6ab17f6c91cc8cc7ba95b6b796025ef6be9bcd2e5d99061a53cb83ca1966347244ba761f12ed1717ddd13af9817fce964790c8fa6a8'));


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  
  }


  app.post('/api/adduser',authorize_cookie,  async(req,res)=>{
      
    const user=req.body.user;
    const password = req.body.password;
    const lvl = req.body.lvl;

    console.log("add-user")
    
    bcrypt.hash(password, 10,  async function(err, hash) {

        const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

        try {
            // Connect to the MongoDB cluster
            await client.connect();
    
            // Make the appropriate DB calls
            await client.db("ticketdatabase").collection("ticketdb").updateOne(
                { title: "Users" },
                {
                $push: {
                        userList:{
                                        $each: [ { 
                                            Username:user,
                                            Password:hash,
                                            Userlvl:lvl,
                                            assignedTicketIDs:[],
                                            assignedProjectIDs:[],
                                            freeUser:true,
                                            sessionID:""
                                        } ]
                                    }
                        }
                }
        );
            

        res.status(200).send({success: true, message: 'mongo success '});

    
        } catch (e) {
            console.error(e);
            res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
            await client.close();
        }

    });

})


app.post('/api/authenticate', async(req,res)=>{
    
    const user=req.body.user;
    const password = req.body.password;
    //console.log(user,password)

    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    var sesh_id = generate_key();

    try {
        // Connect to the MongoDB cluster
        await client.connect();

       const results=await client.db("ticketdatabase").collection("ticketdb").findOne({ title:"Users"},
       {projection: { "userList.Username":1, "userList.Password":1, _id:0 }});
       
        const Results=await client.db("ticketdatabase").collection("ticketdb").updateOne(
        { "userList.Username": user }, 
        { "$set": { "userList.$.sessionID" : sesh_id } });
    
    if(results.userList.some(item=>item.Username===user))
    {
        var obj=results.userList.find(item=>item.Username===user)
        bcrypt.compare(password, obj.Password, function(err, result) {
            if(err)
            {
                return res.send(err);
            }
            else
            {
               if(result)
               {
                console.log("success")
                res.cookie('session_id', sesh_id, {
                    maxAge: 60*10*1000, // 60 secs
                    httpOnly: true,
                    //secure: true, // need https
                    sameSite: true,
                    signed: true,
                  })
                return res.status(200).send({success: true, message: 'passwords  match'});

               }
               else
               {
                console.log("failed")
               return  res.status(401).send({success: false, message: 'passwords do not match'});
               }
            }
        })

    }
    else
    {
        return res.status(401).send({success: false, message: 'mongo success but auth failed '});
    }


    } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
    } finally {
        await client.close();
    }



})
function  generate_key() {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto.randomBytes(16).toString('base64');
};

app.post('/api/authorize', authorize_cookie,async(req,res,next)=>{
   
    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const results=await client.db("ticketdatabase").collection("ticketdb").findOne({ title:"Users"},
        {projection: { "userList.Username":1, "userList.sessionID":1, "userList.Userlvl":1,_id:0 }});
       
        var obj=results.userList.find(item=>item.sessionID=== req.signedCookies.session_id)
       //console.log("obj..."+obj.Username)
    
      return res.status(200).send({success: true, user:obj.Username,userlvl:obj.Userlvl })

    } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
    } finally {
        await client.close();
    }
    
})

app.post('/api/allTicketTableData',authorize_cookie, async(req,res)=>{
    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
    const results=await client.db("ticketdatabase").collection("ticketdb").findOne({title:"Tickets"}, 
    {projection: { _id:0 }})
        
    //console.log(results)
     res.status(200).send({results});

 
    } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
    } finally {
        await client.close();
    }

    })

    app.post('/api/allTicketTableData',authorize_cookie, async(req,res)=>{
        const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    
        try {
            // Connect to the MongoDB cluster
            await client.connect();
     
            // Make the appropriate DB calls
        const results=await client.db("ticketdatabase").collection("ticketdb").findOne({title:"Tickets"}, 
        {projection: { _id:0 }})
            
        console.log(results)
         res.status(200).send({results});
    
     
        } catch (e) {
            console.error(e);
            res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
            await client.close();
        }
    
        })

        app.post('/api/allProjectTableData', async(req,res)=>{
            const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
        
            try {
                // Connect to the MongoDB cluster
                await client.connect();
         
                // Make the appropriate DB calls
            const results=await client.db("ticketdatabase").collection("ticketdb").findOne({title:"Projects"}, 
            {projection: { _id:0 }})
                
            //console.log(results)
             res.status(200).send({results});
        
         
            } catch (e) {
                console.error(e);
                res.status(403).send({success: false, message: 'mongo failed'});
            } finally {
                await client.close();
            }
        
            })
    

app.post('/api/makeTicketComment',authorize_cookie, async(req,res)=>{

    const user =req.body.user;
    const comment =req.body.comment;
    const userlvl =req.body.userlvl;
    const ticketID=req.body.id;

    //console.log(user,comment,userlvl,ticketID)
    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const Results=await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Tickets","ticketList.ticketID":ticketID }, 
            { "$push": { "ticketList.$.ticketComments" : 

            {user:user,
            userlvl:userlvl,
            comment:comment,
            date:Date(),     
            }

        } });


            return res.status(200).send({success: true, message: 'ticket update comment'});


        } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
        await client.close();
         }


})

app.post('/api/updateTicket',authorize_cookie, async(req,res)=>{

    const title =req.body.title;
    const description =req.body.description;
    const fidelity =req.body.fidelity;
    const ticketID=req.body.id;

    //console.log(title,description,fidelity,ticketID)

    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        if(title)
        {
        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Tickets","ticketList.ticketID":ticketID }, 
            { "$set": { "ticketList.$.ticketTitle" : title } });
        }
        if(description)
        {
        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Tickets","ticketList.ticketID":ticketID }, 
            { "$set": { "ticketList.$.ticketDescription" : description } });
        }
        if(fidelity)
        {
        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Tickets","ticketList.ticketID":ticketID }, 
            { "$set": { "ticketList.$.fidelity" : fidelity } });
        }

            return res.status(200).send({success: true, message: 'ticket update edit'});


        } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
        await client.close();
         }


})

app.post('/api/makeProjectComment',authorize_cookie, async(req,res)=>{

    const user =req.body.user;
    const comment =req.body.comment;
    const userlvl =req.body.userlvl;
    const projectID=req.body.id;

    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        const Results=await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Projects","projectList.projectID":projectID }, 
            { "$push": { "projectList.$.projectComments" : 

            {user:user,
            userlvl:userlvl,
            comment:comment,
            date:Date(),     
            }

        } });


            return res.status(200).send({success: true, message: 'project update comment'});


        } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
        await client.close();
         }


})


app.post('/api/updateProject', authorize_cookie,async(req,res)=>{

    const title =req.body.title;
    const description =req.body.description;
    const projectID=req.body.id;


    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        if(title)
        {
        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Projects","projectList.projectID":projectID }, 
            { "$set": { "projectList.$.projectTitle" : title } });
        }
        if(description)
        {
        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Projects","projectList.projectID":projectID }, 
            { "$set": { "projectList.$.projectDescription" : description } });
        }
     

            return res.status(200).send({success: true, message: 'project update edit'});


        } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
        await client.close();
         }


})

app.post('/api/FreeUsers', authorize_cookie,async(req,res)=>{


    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        var users= [];
        const result= await client.db("ticketdatabase").collection("ticketdb")
        .aggregate([
            { '$match': { 'title': 'Users' }},
            {$project: {
                _id: 0,
                title: 1,
                userList: {
                  $filter:
                   {
                    input: "$userList",
                    as: "item",
                    cond: {$eq: ["$$item.freeUser", true ]}                   
                  }
                }
              }
            }]).toArray();

         result[0].userList.map((item,i)=>{
        users.push({user:item.Username,userlvl:item.Userlvl})
         })
        
        return res.status(200).send({users});


        } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
        await client.close();
         }


})
app.post('/api/createProject', authorize_cookie,async(req,res)=>{

    const title=req.body.title;
    const description= req.body.description;
    const teamleader= req.body.teamlead;
    const assigned=req.body.assigned; 
    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});


    var assigned2 = []

    assigned.map((item,i)=>{

        assigned2.push(item.user)
    })
    
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        
        const projectList = await client.db("ticketdatabase").collection("ticketdb").findOne({title:"Projects"}, 
        {projection: { _id:0, title:0 }});

        var projectTotal= projectList.projectList.length+1;
        
        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            { title: "Projects" },
            {
            $push: {
                    projectList:{
                                    $each: [ { 
                                        projectID:projectTotal,
                                        projectTitle:title,
                                        projectDescription:description,
                                        ticketIDList:[],
                                        projectComments:[],
                                                                       
                                        assignedUsers:assigned,
                                        teamLeader:teamleader,

                                        dateCreated:Date(),
                                        dateCompleted:""

                                    
                                    } ]
                                }
                    }
            }
       );
       
      
     await client.db("ticketdatabase").collection("ticketdb").updateMany(
        
        { title:"Users"},
        { $set: { "userList.$[user].freeUser" : false  } },
        {
          arrayFilters: [{ "user.Username":{ $in:assigned2}} ]
        }, { multi: true } );
                
      
        
     res.status(200).send({success: true, message: 'mongo success '});

 
    } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
    } finally {
        await client.close();
    }

    })
   
    

    app.post('/api/makeTicketFromProject', async(req,res)=>{

        const title=req.body.title;
        const description= req.body.description;
        const ProjectID=req.body.id;
        const fidelity=req.body.fidelity; 
        //console.log(title,description,ProjectID,fidelity);
        const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    
     
        try {
            // Connect to the MongoDB cluster
            await client.connect();
    

            const ticketList = await client.db("ticketdatabase").collection("ticketdb").findOne({title:"Tickets"}, 
            {projection: { _id:0, title:0 }});
    
            var ticketTotal= ticketList.ticketList.length+1;
            // Make the appropriate DB calls
            await client.db("ticketdatabase").collection("ticketdb").updateOne(
                { title: "Tickets" },
                {
                $push: {
                        ticketList:{
                                        $each: [ { 
                                            ticketID:ticketTotal,
                                            ticketTitle:title,
                                            ticketDescription:description,
                                            fidelity:fidelity,
                                            assignedProjectID:ProjectID,
                                            assignedUsers:[],
                                            ticketComments:[],
                                            dateCreated:Date(),
                                            dateCompleted:""
                                        } ]
                                    }
                        }
                }
        );
            

        res.status(200).send({success: true, message: 'mongo success create Ticket '});

    
        } catch (e) {
            console.error(e);
            res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
            await client.close();
        }

    });

    app.post('/api/Logout',async(req,res)=>{
        /*
        res.clearCookie(req.signedCookies.session_id);
        req.cookies(req.signedCookies.session_id, {expires: Date.now()});
        res.status(200).send({success: true, message: 'logged out'});
        */
       res.clearCookie('session_id');
       res.status(200).send({success: true, message: 'logged out'});
        return;

    })




app.post('/api/completeProject', async(req,res)=>{

        const projectID=req.body.id;
    
        const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
    
        try {
            await client.connect();
            var date = Date();
            await client.db("ticketdatabase").collection("ticketdb").updateOne(
                {title:"Projects","projectList.projectID":projectID }, 
                { "$set": { "projectList.$.dateCompleted" : date } });
           
          
                return res.status(200).send({success: true, message: 'project completed update'});
    
            } catch (e) {
            console.error(e);
            res.status(403).send({success: false, message: 'mongo failed'});
            } finally {
            await client.close();
             }  
    })

    

app.post('/api/completeTicket',authorize_cookie, async(req,res)=>{

    const ticketID=req.body.id;

    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        var date = Date();

        await client.db("ticketdatabase").collection("ticketdb").updateOne(
            {title:"Tickets","ticketList.ticketID":ticketID }, 
            { "$set": { "ticketList.$.dateCompleted" : date } });
       
      
            return res.status(200).send({success: true, message: 'ticket completed update'});

        } catch (e) {
        console.error(e);
        res.status(403).send({success: false, message: 'mongo failed'});
        } finally {
        await client.close();
         }  
})







//========================================================================================================
function authorize_cookie(req,res,next)
{
    if(req.signedCookies.session_id)
    {
        next();
        return;
    }
    else
    {
        res.status(401).send({success: false, message: 'not authorized'})
        return;
    }

    
}
//======================================================================================================
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});