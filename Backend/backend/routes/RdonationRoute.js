import express from "express";

import { Rdonation } from "../models/Rdonationmodel.js";
import { Cdonation } from "../models/Cdonatinmodel.js";
import { Volunteer } from "../models/volunteermodel.js";

import multer from "multer";
import path from "path";
import { User } from "../models/usermodel.js";

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

router.post("/", upload.single("file"), async (request, response) => {
  try {
    console.log(request.body);
    console.log(request.file);
    let user = null;
    const donar = request.body.donar;
    if (donar) {
      console.log(donar);
      user = await User.findOne({ name: donar });
      console.log(user);
      if (!user) {
        return response.status(404).send({ message: "user not found" });
      }
    }

    const newBook = {
      name: request.body.name,
      dsc: request.body.dsc,
      category: request.body.category,
      size: request.body.size,
      color: request.body.color,
      condition: request.body.condition,
      brand: request.body.brand,
      quantity: request.body.quantity,
      status: request.body.status,
      image: request.file.filename,
      model: request.body.model,
      reading_evel: request.body.reading_evel,
      language: request.body.language,
      use: request.body.use,
      age_range: request.body.age_range,
      donar: user ? user._id : null,
    };
    const Rdonationn = await Rdonation.create(newBook);

    if (user) {
      user.donations.push(Rdonationn._id);
      await user.save();
    }

    console.log(request.body);
    return response.status(200).send({ message: "donation added" });
  } catch (error) {
    console.log(error.message);
    console.log("noooo");
    response.status(500).send({ message: error.message });
  }
});

router.get("/", async (request, response) => {
  try {
    const Rdonationn = await Rdonation.find({ status: null }).populate("donar");

    return response.status(200).json({
      count: Rdonationn.length,
      data: Rdonationn,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const Rdonation = await Rdonation.findById(id)

    return response.status(200).json({
      count: Rdonation.length,

      data: Rdonation,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const name = request.body.nameVolunteer;
    console.log(request.body);
    const objectName = await Volunteer.findOne({ name: name });
    if (!objectName) {
      console.log("1")
      return response.status(404).json({ message: "Volunteer not found" });
   
    }

    const Rdonationn = await Rdonation.findById(id);

    if (!Rdonationn) {
      console.log("2")
      return response.status(404).json({ message: "Book not found" });
    }

    console.log(Rdonationn.image);

    const newCdonation = {
      name: Rdonationn.name,
      dsc: Rdonationn.dsc,
      category: Rdonationn.category,
      quantity: Rdonationn.quantity,
      size: Rdonationn.size,
      color: Rdonationn.color,
      use: Rdonationn.use,
      age_range: Rdonationn.age_range,
      language: Rdonationn.language,
      reading_evel: Rdonationn.reading_evel,
      model: Rdonationn.model,
      condition: Rdonationn.condition,
      image: Rdonationn.image,
      brand: Rdonationn.brand,
      points: Rdonationn.points,
      volunteer: objectName._id,
      points: request.body.points,
      donar: Rdonationn.donar,
      // Add any other fields you want to copy from Rdonationn to Cdonation
    };

    console.log(Rdonationn.donar);

    const Donar = await User.findOne({ _id: Rdonationn.donar });

    if (!Donar) {
      return response.status(404).json({ message: "Donar not found" });
      console.log("3")
    }

    Donar.Cdonations.push(id);

    await Donar.save();

    objectName.donations.push(id);
    await objectName.save();

    const Rdonationnn = await Cdonation.create(newCdonation);

    // Delete the Rdonation after successfully creating the Cdonation
    await Rdonation.findByIdAndDelete(id);

    return response.status(201).send(Rdonationnn);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


// router.put("/:id", async (request, response) => {
//   try {
//     const { id } = request.params;

//     const name = request.body.nameVolunteer;
//     console.log(request.body);
//     const objectName = await Volunteer.findOne({ name: name });
//     if (!objectName) {
//       return response.status(404).json({ message: "Volunteer not found" });
//     }

//     const Rdonationn = await Rdonation.findById(id);

//     if (!Rdonationn) {
//       return response.status(404).json({ message: "Book not found" });
//     }

//     console.log( Rdonationn.image)
  

//     const newCdonation = {
//       name: Rdonationn.name,
//       dsc: Rdonationn.dsc,
//       category: Rdonationn.category,
//       quantity: Rdonationn.quantity,
//       size: Rdonationn.size,
//       color: Rdonationn.color,
//       use: Rdonationn.use,
//       age_range: Rdonationn.age_range,
//       language: Rdonationn.language,
//       reading_evel: Rdonationn.reading_evel,
//       model: Rdonationn.model,
//       condition: Rdonationn.condition,
//       image: Rdonationn.image,
//       brand: Rdonationn.brand,
//       points: Rdonationn.points,
//       volunteer: objectName._id,
//       points: request.body.points,
//       donar: Rdonationn.donar, 
//       // Add any other fields you want to copy from Rdonationn to Cdonation
//     };

//     console.log(Rdonationn.donar)

//    const Donar =await User.findOne({_id:Rdonationn.donar})

//     if (!Donar) {
//       return response.status(404).json({ message: "Donar not found" });
//     }

//     Donar.Cdonations.push(id);

//     await Donar.save();

  

//     objectName.donations.push(id);
//     await objectName.save();

//     const Rdonationnn = await Cdonation.create(newCdonation);

//     Rdonationn.status = 1;

//     await Rdonationn.save();

//     return response.status(201).send(Rdonationnn);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// router.put("/:id", async (request, response) => {
//   try {

//     const { id } = request.params;

//  const name = request.body.nameVolunteer;

//  const objectName = await Volunteer.findOne({name:name});

//  if (!objectName) {
//   return response.status(404).json({ message: "Volunteer not found" });
// }

//  const updatedDonation ={
//   name:request.body.name,
//   dsc:request.body.dsc,
//   category:request.body.category,
//   status:request.body.status,
//   volunteer:objectName._id,
//  }

//     const result = await Rdonation.findByIdAndUpdate(id, updatedDonation);

//     objectName.donations.push(id);

//     await objectName.save();

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

    const result = await Rdonation.findByIdAndDelete(id);

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
