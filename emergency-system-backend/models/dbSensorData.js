import mongoose from "mongoose";

//DB document sensor data structure
const sensorsSchema = mongoose.Schema({
  BPM: String,
  Temperature: String,
  Latitude: String,
  Longitude: String,
  Fall: String,
});

export default mongoose.model("Datas", sensorsSchema);
