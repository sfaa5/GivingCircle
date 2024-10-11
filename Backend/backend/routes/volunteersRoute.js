import express from "express";
import { Volunteer } from "../models/volunteermodel.js";
import { Leader } from "../models/leadermodel.js";
// import { redisClient } from "./usersRoute.js";
const router = express.Router();

export let flag;
//Route for Login

router.post("/login", (req, res) => {
  // const {email,password} = req.body;
  const email = req.body.email;
  const password = req.body.password;

  Volunteer.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("the password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  });
});





// if (
//   !request.body.name ||
//   !request.body.email ||
//   !request.body.password
// ) {
//   return response.status(400).send({
//     message: `send all required fields: title, author, publishYear`,
//   });
// }

// const name = request.body.nameLeader;



// console.log(name)

// const vvvv =await Leader.findOne({name:name});

// if(!vvvv){
// return console.log("leader not exist")
// }


// const newBook = {
//   name: request.body.name,
//   email: request.body.email,
//   password: request.body.password,
//   leader: vvvv._id,

// };


// const volunteer = await Volunteer.create(newBook);

// vvvv.volunteers.push(volunteer._id);

// await vvvv.save(); // Save the updated leader document

// flag=false
// return response.status(201).send(volunteer);




//Route for save volunteer
router.post("/", async (request, response) => {
  try {
    console.log(request.body.name)
    console.log(request.body.email)
    console.log(request.body.password)
    console.log("0")
    if (!request.body.name || !request.body.email || !request.body.password) {
      return response.status(400).send({
        message: `send all required fields: title, author, publishYear`,
      });
    }
    console.log("1")

    let leader = null;
   const name= request.body.nameLeader;
    if (name) {
      console.log(name)
      leader = await Leader.findOne({ name: name});
      console.log(leader)
      if (!leader) {
        return response.status(404).send({ message: "Leader not found" });
      }
    }
    console.log("2")

   

    const newBook = {
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      leader: leader ? leader._id:null,
    };
    
    console.log("3")

    const volunteer = await Volunteer.create(newBook);

    if (leader) {
      leader.volunteers.push(volunteer._id);
      await leader.save(); // Save the updated leader document
  }

   
    return response.status(201).send(volunteer);
  } catch (error) {
    console.log(error.message);
    console.log("noooo");
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All volunteers from database
router.get("/", async (request, response) => {
 


  try {
    
   

  
    const  data = await Volunteer.find({})
        .populate("leader")
        .populate("donations");
      
 

    return response.send({
  
      data
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One volunteers from database by id
router.get("/:id", async (request, response) => {
  let results;
 
  try {
    const { id } = request.params;
    // const volunteer = await Volunteer.findById(id).populate('leader').populate('donations');
      results = await Volunteer.findById(id)
        .populate("leader")
        .populate("donations");
      // await redisClient.set(`Volunteers?id_=${id}`, JSON.stringify(results));
   
    return response.send({
   
      data: results,
    });

    // return response.status(200).json({
    //   count: volunteer.length,

    //   data: volunteer,
    // });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});





//Route for Update a volunteer

router.put("/:id", async (request, response) => {
  try {
    // if (!request.body.name || !request.body.email || !request.body.password) {
    //   return response.status(400).send({
    //     message: `send all required fields: title, author, publishYear`,
    //   });
    // }

    // const { id } = request.params;

    // const result = await Volunteer.findByIdAndUpdate(id, request.body);

    // if (!result) {
    //   return response.status(404).json({ message: "Book not found" });
    // }
    // flag = false;

    // return response.status(200).send({ message: "Book updated successfully" });


    if (!request.body.name || !request.body.email || !request.body.password) {
      return response.status(400).send({
        message: `send all required fields: title, author, publishYear`,
      });
    }

    const { id } = request.params;
    console.log(id)
    console.log(request.body.nameLeader)

    // Find the volunteer by ID
    const volunteer = await Volunteer.findById(id);
    if (!volunteer) {
      return response.status(404).json({ message: "Volunteer not found" });
    }

    // Check if the leader's name has changed
    let leader = null;
    if (request.body.nameLeader && request.body.nameLeader !== volunteer.leader) {
      console.log("here")
      console.log(request.body.nameLeader);
      leader = await Leader.findOne({ name: request.body.nameLeader });
      if (!leader) {
        return response.status(404).send({ message: "Leader not found" });
      }
    }

    // Remove the volunteer from the leader's list if the leader's name is not provided
    // or if the leader's name is deleted
    if (request.body.nameLeader === ""||request.body.nameLeader===null) {
      if (volunteer.leader) {
        console.log("hii3")
        leader = await Leader.findById(volunteer.leader);
        if (leader) {
          leader.volunteers.pull(volunteer._id);
          await leader.save();
        }
      }
      volunteer.leader = null;
    } else {
      console.log("hii4")
      // Update the leader's volunteer list if the leader has changed
      volunteer.leader = leader ? leader._id : null;
      if (leader) {
        leader.volunteers.addToSet(volunteer._id);
        await leader.save();
      }
    }
console.log("out")
    // Update the volunteer's data
    volunteer.name = request.body.name;
    volunteer.email = request.body.email;
    volunteer.password = request.body.password;
    // volunteer.leader = leader ? leader._id : null;

    // Save the updated volunteer
    await volunteer.save();

    // Update the leader's volunteer list if the leader has changed
    // if (leader) {
    //   leader.volunteers.push(volunteer._id);
    //   await leader.save();
    // }

 
    flag=false;
    return response.status(200).send({ message: "Volunteer updated successfully" });

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a volunteer
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
console.log(id)
    const result = await Volunteer.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    flag = false;
    return response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export function flagC(){
  flag=false
} 

export default router;
