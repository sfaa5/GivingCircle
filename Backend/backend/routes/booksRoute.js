import express from "express";
import { Book } from "../models/Bookkmodel.js"; // Ensure the file name and path are correct

const router = express.Router();

// Route for Get All Books from database
router.get("/", async (request, response) => {
  try {
    const books = await Book.find({}).populate("donar").populate("volunteer");
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


router.delete("/:id",async (req,res)=>{
  try{
    const {id} = req.params;
    const result =await Book.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).send({ message: "Book deleted successfully" });
  }catch(error){

    res.status(500).send({ message: error.message });
  }
})

export default router;
