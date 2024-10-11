import mongoose from "mongoose" ;

const volunteerSchema = mongoose.Schema(


    {
       name: {
        type:String,
       },
       email:{
        type:String,
       },
       password:{
        type:Number,
       },
       leader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Leader',
       },
       donations:[{ type:mongoose.Schema.Types.ObjectId,ref:'Rdonation'}]
    

    },{
        timestamps:true
    }
)

export const Volunteer = mongoose.model('Volunteer',volunteerSchema);