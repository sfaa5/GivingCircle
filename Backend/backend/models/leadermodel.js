import mongoose from "mongoose";

const LeaderSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: Number,
  },
  fullName:{
    type:String,
  },
  volunteers: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }
],
image:String
});

export const Leader = mongoose.model("Leader", LeaderSchema);
