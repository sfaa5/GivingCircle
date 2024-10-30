import mongoose from "mongoose" ;

const BookScema= mongoose.Schema(


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
         status:{
        type:Boolean,
        },
        volunteer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Volunteer',
        },
        needy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'needy',
        },
        donar:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
           },
        points:Number,
        size:String,
        color:String,
        use:String,
        age_range:String,
        language:String,
        reading_evel:String,
        model:String,
        image:String,
        brand:String,
    
    }
    )
    
    export const Book = mongoose.model('Book', BookScema );