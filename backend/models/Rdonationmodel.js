import mongoose from "mongoose" ;

const RdonationScema= mongoose.Schema(


{
    name:{
           type:String,
    },
    dsc:{
           type:String,
    },
    category:{
               type:String,
    },
    quantity:{
        type:Number,
    },
    size:{
        type:String,
    },
    color:{
        type:String,
    },
    use:String,
    age_range:String,
    language:String,
    reading_evel:String,
    model:String,
    condition:{
        type:String,
    },
    status:{
        type:Boolean,
    },

    volunteer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Volunteer',
    },
    image:String,
    brand:String,
    points:Number,
    donar:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
       },
    createdAt: {
        type: Date,
        default: Date.now,
      },


}
)

export const Rdonation = mongoose.model('Rdonation', RdonationScema );