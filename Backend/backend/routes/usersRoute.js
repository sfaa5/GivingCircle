import express from "express";

import { User } from "../models/usermodel.js";
// import redis from "redis"
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js"
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


// let Users ="users";

// let dc  ;

//redis setup
//  export let redisClient;

// (async()=>{
//   redisClient = redis.createClient({
//     host:'redis-server',
//     port:6379
//   })

//   redisClient.on("error",(error)=>console.log(`Error weaaa:${error}`));

//   await redisClient.connect();
// })();  

// signUp 
router.post("/signUp",  (req, res) => {
  // const {email,password} = req.body;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
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

//Route for Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ me: "User not found" });
    }

    const passwordMatch =(password === user.password);

    if (!passwordMatch) {
      return res.status(401).json({ me: "Incorrect password" });
    }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Passwords match, send a success message

   return res.status(200).json({ me:"success",  user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ me: "Internal server error" });
  }
});



// Route for save a new User
router.post("/",upload.single("file"), async (request, response) => {
  try {
    const { name, email, password, fullName } = request.body;
const image =request.file.filename;

    // Check if the user with the given name or email already exists
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      if (existingUser.name === name) {
        return response.json("User name is already taken");
      } else if (existingUser.email === email) {
        return response.json("Email is already associated with an account");
      }
    }

    // Check if all required fields are provided
    if (!name || !email || !password || !fullName) {
      return response.status(400).send({
        message: "Please provide all required fields: name, email, password, fullName",
      });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password,
      fullName,
      image,
    });

    // Save the new user to the database
     const user =  await newUser.save();

    response.status(200).send({ message: "User added successfully",user });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: "Internal server error" });
  }

});

// Route for Get All Books from database
router.get("/", async (request, response) => {

  // let results;
  // let isCached = false;
 
  // const fetchUsersAndUpdateCache = async () => {
  try{  const users = await User.find();
     response.status(200).json(users);
    
    // Assuming User is your Mongoose model
  //   redisClient.set('users', JSON.stringify(users));
  // };
  
  // fetchUsersAndUpdateCache();
  




  // try {

  //   const cacheResults = await redisClient.get(Users);

  //   if(cacheResults && dc){

  //     isCached=true;
  //     results=JSON.parse(cacheResults);

  //   }else{

  //     results = await User.find({});
  //     await redisClient.set(Users,JSON.stringify(results))
  //     dc=true
  //   }

  //   return response.send({
  //     fromCache:isCached,
  //     data:results,
  //   });







    // redisClient.get('users', (err, cachedUsers) => {
    //   if (err) {
    //     console.error('Error getting cached users:', err);
    //     return res.status(500).json({ error: 'Internal Server Error' });
    //   }
  
    //  return response.json(JSON.parse(cachedUsers));
    // });



  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Books from database by id
router.get("/:id", async (request, response) => { 
   const { id } = request.params;

  try {
  
   
      
    const  results = await User.findById(id);
    

    return response.send({ data:results})

 
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for Update a User

router.put("/:id", async (request, response) => {
  try {
    if (!request.body.name || !request.body.email || !request.body.password) {
      return response.status(400).send({
        message: `send all required fields: title, author, publishYear`,
      });
    }

    const { id } = request.params;

    const result = await User.findByIdAndUpdate(id, request.body);

    dc=false;

    if (!result) {
      return response.status(404).json({ message: "Book not found" });
    }

    return response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    console.log(error.message);
    console.log("fffffffff")
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await User.findByIdAndDelete(id);
  
    if (!result) {
      return response.status(404).json({ message: "user not found" });
    }
  
    return response.status(200).send({ message: "user deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
