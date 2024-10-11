import express from "express";

import { Cdonation } from "../models/Cdonatinmodel.js";
import { Rdonation } from "../models/Rdonationmodel.js";
import { Needy } from "../models/needymodel.js";
import { Book } from "../models/Bookkmodel.js";

const router = express.Router();

router.post("/", async (request, response) => {
    try {
  
      const newBook = {
        name: request.body.name,
        dsc: request.body.dsc,
        category: request.body.category,
        quantity: request.body.quantity,
        status:request.body.status,
  
      };
      const Cdonationn = await Cdonation.create(newBook);
      return response.status(201).send(Cdonationn);
    } catch (error) {
      console.log(error.message);
      console.log("noooo");
      response.status(500).send({ message: error.message });
    }
  });

  //Route for transfer donation from c to book

  router.put("/:id", async (request, response) => {
    try {
      const { id } = request.params;
  
      // const name = request.body.needy;
      console.log(request.body);
      // const objectName = await Needy.findOne({ name: name });
      // if (!objectName) {
      //   return response.status(404).json({ message: "needy not found" });
      // }

     
  
      const Cdonationn = await Cdonation.findById(id);
  
      
      console.log(Cdonationn.quantity)
      console.log(request.body.quantity)
      console.log("outTop")

      if (!Cdonationn) {
        return response.status(404).json({ message: "Book not found" });
      }
  
      if(Cdonationn.quantity>request.body.quantity)
        {
          Cdonationn.quantity=Cdonationn.quantity-request.body.quantity;
          console.log(Cdonationn.quantity)
          console.log(request.body.quantity)
          await Cdonationn.save();
        }
        console.log(Cdonationn.quantity)
        console.log(request.body.quantity) 

      console.log(Cdonationn.image);
      console.log(Cdonationn);


      const newCdonation = {
        name: Cdonationn.name,
        dsc: Cdonationn.dsc,
        category: Cdonationn.category,
        quantity:request.body.quantity,
        size: Cdonationn.size,
        color: Cdonationn.color,
        use: Cdonationn.use,
        age_range: Cdonationn.age_range,
        language: Cdonationn.language,
        reading_evel: Cdonationn.reading_evel,
        model: Cdonationn.model,
        condition: Cdonationn.condition,
        image: Cdonationn.image,
        brand: Cdonationn.brand,
        points: Cdonationn.points,
        volunteer: Cdonationn.volunteer,
        // points: request.body.points,
        donar: Cdonationn.donar,
        // Add any other fields you want to copy from Cdonationn to Cdonation
      };
  
      console.log(Cdonationn.donar);
  
      // const Donar = await User.findOne({ _id: Cdonationn.donar });
  
      // if (!Donar) {
      //   return response.status(404).json({ message: "Donar not found" });
      // }
  
      // Donar.Cdonations.push(id);
  
      // await Donar.save();
  
      // objectName.donations.push(id);
      // await objectName.save();

      console.log(Cdonationn.quantity)
      console.log(request.body.quantity) 
  

      const Bookk = await Book.create(newCdonation);

      if(Cdonationn.quantity===request.body.quantity)
        {
          console.log(Cdonationn.quantity)
          console.log(request.body.quantity)
          // Delete the Rdonation after successfully creating the Cdonation
          await Cdonation.findByIdAndDelete(id);
        }
  
     
  
      return response.status(201).send(Bookk);
    } catch (error) {
      console.log("sssasasasasasaas");
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });



  // Route for Get All Books from database
router.get("/", async (request, response) => {
  try {
    const donations = await Cdonation.find({}).populate('volunteer').populate("donar");
    return response.status(200).json({
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



router.get("/getCategory/Clothing", async (request, response) => {
  try {
    const donations = await Cdonation.find({category:"Clothing"}).populate('volunteer').populate("donar");;
    return response.status(200).json({
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.get("/getCategory/Electronics", async (request, response) => {
  try {
    const donations = await Cdonation.find({category:"Electronics"}).populate('volunteer').populate("donar");;
    return response.status(200).json({
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.get("/getCategory/Toys", async (request, response) => {
  try {
    const donations = await Cdonation.find({category:"Toys"}).populate('volunteer').populate("donar");;
    return response.status(200).json({
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get("/getCategory/Books", async (request, response) => {
  try {
    const donations = await Cdonation.find({category:"Books"}).populate('volunteer').populate("donar");;
    return response.status(200).json({
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});



router.get("/getCategory/HomeEssentials", async (request, response) => {
  try {
    const donations = await Cdonation.find({category:"Home Essentials"}).populate('volunteer').populate("donar");
    return response.status(200).json({
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.log(error.message); 
    response.status(500).send({ message: error.message });
  }
});

  //Route to show the confirmed donations

  // router.get("/", async (request, response) => {
  //   try {
  //       const [rdonations, cdonations] = await Promise.all([
  //           Rdonation.find({ status: true }),
  //           Cdonation.find({})
  //         ]);

  //   //   if (!Cdonationn || Cdonationn.length === 0) {
  //   //     return response.status(404).json({ message: "Donation not found" });
  //   //   }

  //   const createdDonations = await Promise.all(
  //     rdonations.map(async (rdonation) => {
  //       // Create a new donation in the Cdonation collection based on the rdonation
  //       const newDonation = new Cdonation({
  //         name: rdonation.name,
  //         dsc: rdonation.dsc,
  //         category: rdonation.category,
  //         quantity: rdonation.quantity,
  //         // Add any other fields you want to copy from rdonation to Cdonation
  //       });
  //       return await newDonation.save();
  //     })
  //   );
    
  //   const cccc = await Cdonation.find({});

  //   return response.status(200).json({
  //     count: createdDonations.length,
  //     data: cccc,
  //   });
    
  //   } catch (error) {
  //     console.log(error.message);
  //     console.log("nooo");
  //     response.status(500).send({ message: error.message });
  //   }
  // }); 



  router.get("/:id", async (request, response) => {
    try {
      const { id } = request.params;
  
      const Cdonationn = await Cdonation.findById(id).populate('volunteer');
  
      return response.status(200).json({
        count: Cdonationn.length,
       
        data: Cdonationn,
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });


  // router.put("/:id", async (request, response) => {
  //   try {
      
  //     const { id } = request.params;
  
  //     const result = await Cdonation.findByIdAndUpdate(id, request.body);
  
  //     if (!result) {
  //       return response.status(404).json({ message: "Book not found" });
  //     }
  
  //     return response.status(200).send({ message: "Book updated successfully" });
  //   } catch (error) {
  //     console.log(error.message);
  //     response.status(500).send({ message: error.message });
  //   }
  // });

  router.delete("/:id", async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Cdonation.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: "Book not found" });
      }
  
      return response.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });


  export default router;

