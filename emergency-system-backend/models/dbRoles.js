import mongoose from "mongoose";

//DB document Role structure
const Role = new mongoose.Schema({
  name: String,
});

export default mongoose.model("Role", Role);
