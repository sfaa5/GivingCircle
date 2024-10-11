import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";



import { User } from "./models/usermodel.js";
import usersRoute from "./routes/usersRoute.js"
import leadersRoute from "./routes/leadersRoute.js"
import volunteerRoute from "./routes/volunteersRoute.js"
import  Rdonation from "./routes/RdonationRoute.js"
import  Cdonation  from "./routes/CdonatonRoute.js";
import needyRouter from "./routes/needyRoute.js";
import booksRoute from "./routes/booksRoute.js";
import cors from 'cors';
import multer from "multer";
import path from "path";



const app = express();
// Middleware for parsing request body
app.use(express.json());
app.use(express.static('public'))

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
// app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:false}));
// Middleware for handling CORS POLICY
// option 1: Allow all Origins with default of cors(*)
 app.use(cors());

// *********option 2: Allow Custom Origins 
// app.use(
//   cors({
//     origin:'http://localhost:3000',
//     method:['GET','POST','PUT','DELETE'],
//     allowedHeaders:['Content-Type'],
//   })
// );

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("welcome to ...");
});

app.use('/books',usersRoute);

app.use('/leaders',leadersRoute);

app.use('/volunteers',volunteerRoute);

app.use('/Rdonation',Rdonation);
app.use('/Cdonation',Cdonation);

app.use('/needy',needyRouter);

app.use('/Booksss',booksRoute);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`aPP IS ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
