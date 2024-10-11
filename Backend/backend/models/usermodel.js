import mongoose from "mongoose";

const userSchema = mongoose.Schema(

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
        fullName:String,
        donations: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Rdonation' }
        ]
        ,
        Cdonations: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Cdonation' }
        ],
        image:String

    }
);

export const User = mongoose.model('user',userSchema);