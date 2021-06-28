import mongoose from "mongoose";

//DB document user data structure
const User = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  data: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Datas",
    },
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

export default mongoose.model("User", User);
