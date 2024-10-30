import mongoose from "mongoose";

const needySchema = mongoose.Schema(

    {
        name: {
            type: String,
         
        },
        email: {
            type: String,
        
        },
        password: {
            type: String,
         
        },
        donation:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Cdonation',
        },
        fullName:String,
        age:Number,
        work:String,
        numberOfChildern:Number,
        salary:Number,
        gender:String,
        medicalRecord:String,
        points:Number,
   
    }
);

export const Needy = mongoose.model('needy',needySchema);