import express from "express";

import { Leader } from "../models/leadermodel.js";

// import { redisClient } from "./usersRoute.js";
import { Volunteer } from "../models/volunteermodel.js";
import { flagC } from "./volunteersRoute.js";
import multer from "multer";
import path from "path";


const router = express.Router();


const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "./public/Images");
  },
  filename: (request, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// let dc ;

//Route for  login leader
router.post("/login", (req, res) => {
    // const {email,password} = req.body;
    const email = req.body.email;
    const password = req.body.password;
  
    Leader.findOne({ email: email }).then((user) => {
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


  router.post("/", upload.single("file"), async (request, response) => {
    try {
      // Check if file is uploaded
      if (!request.file) {
        return response.status(400).send({ message: "Image file is required" });
      }
  
      const image = request.file.filename;
  
      console.log(image);
      console.log(request.body);
  
      // Validate required fields
      const { name, email, password, fullName } = request.body;
      if (!name || !email || !password || !fullName) {
        return response.status(400).send({
          message: "All fields are required: name, email, password, fullName",
        });
      }
  
      // Create a new leader instance
      const leader = new Leader({
        name,
        email,
        password,
        fullName,
        image,
      });
  
      // Save the leader to the database
      await leader.save();
  
      // Send a success response
      response.status(201).send({ message: "Leader created successfully", leader });
  
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: "Server error" });
    }
  });
  




//   // Route for save a new User
// router.post("/", async (request, response) => {
//     try {
//       const { name, email } = request.body;
//       User.findOne({ name: name }).then(async (user) => {
//         if (user) {
//           if (user.name === name) {
//             response.json("user name is taken");
//           } else if (user.email === email) {
//             response.json("email has already account");
//           }
//         } else {
//           if (
//             !request.body.name ||
//             !request.body.email ||
//             !request.body.password
//           ) {
//             return response.status(400).send({
//               message: `send all required fields: title, author, publishYear`,
//             });
//           }
  
//           const newBook = {
//             name: request.body.name,
//             email: request.body.email,
//             password: request.body.password,
//           };
  
//           const user = await User.create(newBook);
//           return response.status(201).send(user);
//         }
//       });
//     } catch (error) {
//       console.log(error.message);
//       response.status(500).send({ message: error.message });
//     }
//   });

  // Route for Get All leaders from database
router.get("/", async (request, response) => {

  // let results;
  // let isCached = false;

    try {
      // const leaders = await Leader.find({}).populate('volunteers');
      // const cacheResults = await redisClient.get('Leaders');

      // if(cacheResults && dc){
  
      //   isCached=true;
      //   results=JSON.parse(cacheResults);
  
      // }else{

      //   results = await Leader.find({}).populate('volunteers');
      //   await redisClient.set('Leaders',JSON.stringify(results))
      //   dc=true
      // }
  
      // return response.send({
      //   fromCache:isCached,
      //   data:results,
      // });
      const users = await Leader.find().populate('volunteers');
      response.status(200).json(users);
      
  
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });
 
  
  // Route for Get One Leader from database by id
router.get("/:id", async (request, response) => {
  // let results;
  // let isCached = false;
    try {
      const { id } = request.params;
  
      // const leaders = await Leader.findById(id).populate('volunteers');




      // const cacheResults = await redisClient.get(`Leaders?id_=${id}`);


      // if(cacheResults && dc){
  
      //   isCached=true;
      //   results=JSON.parse(cacheResults);
  
      // }else{

        const results = await Leader.findById(id);
        // await redisClient.set(`Leaders?id_=${id}`,JSON.stringify(results))
        // dc=true
      // }

  
      return response.send({data:results});

    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });


  router.delete("/remove/:id", async (request, response) => {
    try {
      const { id } = request.params;
      console.log(id);
      
      // Find the volunteer by ID
      const volunteer = await Volunteer.findById(id);
      if (!volunteer) {
        return response.status(404).json({ message: "Volunteer not found" });
      }
      
      const leader = await Leader.findById(volunteer.leader);
      if (!leader) {
        return response.status(404).send({ message: "Leader not found" });
      }
  
      leader.volunteers.pull(volunteer._id);
      await leader.save();
      console.log(leader.volunteers)
  
      volunteer.leader = null;
      await volunteer.save();

      flagC()
  
      response.status(200).send({ message: "Volunteer removed from leader successfully" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  //Route for Update a leader

router.put("/:id", async (request, response) => {
    try {
      if (!request.body.name || !request.body.email || !request.body.password) {
        return response.status(400).send({
          message: `send all required fields: title, author, publishYear`,
        });
      }
  
      const { id } = request.params;
      console.log("hiii")
  
      const result = await Leader.findByIdAndUpdate(id, request.body);
  
      if (!result) {
        return response.status(404).json({ message: "Book not found" });
      }
      // dc=false
  
      return response.status(200).send({ message: "Book updated successfully" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  // Route for Delete a leader
router.delete("/:id", async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Leader.findByIdAndDelete(id);

      flagC()
  
      if (!result) {
        return response.status(404).json({ message: "Book not found" });
      }

      // dc=false
  
      return response.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });


export default router;
