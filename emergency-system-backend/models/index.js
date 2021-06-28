import mongoose from "mongoose";
import User from "./dbUserData.js";
import Datas from "./dbSensorData.js";
import Role from "./dbRoles.js";

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.data = Datas;
db.role = Role;

db.ROLES = ["user", "admin", "moderator"];

export default db;

// format DB
// {
//    "username": "a",
//    "email": "x",
//    "password": "a",
//    "data": [
//        {
//         "BPM": "x",
//         "Temperature": "a",
//         "Latitude": "a",
//         "Longitude": "x",
//         "Fall": " noooo "
//         }
//     ],
//    "role": [{"name":"user"}]
// }
