import express from "express";


import { Needy } from "../models/needymodel.js";


const router = express.Router();


router.post("/", async (request, response) => {
    try {
      const { name, email, password, fullName ,age,work,numberOfChildern,salary,gender,medicalRecord,points} = request.body;
  
      // Check if the user with the given name or email already exists
      const existingUser = await Needy.findOne({ $or: [{ name }, { email }] });
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
      const newUser = new Needy({
        name,
        email,
        password,
        fullName,age,work,numberOfChildern,salary,gender,medicalRecord,points,
      });
  
      // Save the new user to the database
      await newUser.save();
  
      response.status(200).send({ message: "User added successfully" });
    } catch (error) {
      console.error(error.message);
      response.status(500).send({ message: "Internal server error" });
    }
  
  });




  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Needy.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ me: "User not found" });
      }
  
      const passwordMatch =(password === user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ me: "Incorrect password" });
      }
  
      // Passwords match, send a success message
      res.status(200).json({ me: "success",user });
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  router.get("/", async (request, response) => {

  
 
    try{  const users = await Needy.find();
       response.status(200).json(users);
      

  
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });




  router.get("/:id", async (request, response) => { 
    const { id } = request.params;
 
   try {
     const  results = await Needy.findById(id);
     return response.send({ data:results}) 
   } catch (error) {
     console.log(error.message);
     response.status(500).send({ message: error.message });
   }
 });




 router.put("/:id", async (request, response) => {
    try {
      if (!request.body.name || !request.body.email || !request.body.password) {
        return response.status(400).send({
          message: `send all required fields: title, author, publishYear`,
        });
      }
  
      const { id } = request.params;
  
      const result = await Needy.findByIdAndUpdate(id, request.body);
  
  
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


  router.put("/:id/points", async (request, response) => {
    try {
      const { id } = request.params;
      const { points } = request.body;
  
      if (points === undefined) {
        return response.status(400).send({
          message: "Please provide the points value",
        });
      }
  
      const result = await Needy.findByIdAndUpdate(
        id,
        { points: points },
        { new: true } // This option returns the modified document
      );
  
      if (!result) {
        return response.status(404).json({ message: "User not found" });
      }
  
      return response.status(200).send({ message: "Points updated successfully" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });




  router.delete("/:id", async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Needy.findByIdAndDelete(id);
    
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