import {User} from "../../types/user";
import { Schema, model } from "mongoose";

//create a new schema for user
const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
      _id: false,
      versionKey: false,
    
  }
);

//create a new model for user
const userModel = model<User>("Users", userSchema);


export { userModel };
