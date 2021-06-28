import express, { Router } from "express";
import mongoose from "mongoose";
import Cors from "cors";
import bodyParser from "body-parser";
import middlewares from "middlewares";
import SerialPort from "serialport";
import ReadLine from "@serialport/parser-readline";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import db from "./models/index.js";
import authenticationRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

//App config
dotenv.config();

const app = express();
const server = createServer(app);
const router = Router();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

//app.use(express.json()); //using exp w/ body parser
app.use(
  Cors({
    origin: "http://localhost:3000",
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// //Listener
// const Readline = SerialPort.parsers.Readline;
// const port = new SerialPort("COM5", {
//   baudRate: 9600,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });

// const parser = new Readline("\r\n");
// port.pipe(parser);

const connection_url = process.env.MONGO_URI;

const Role = db.role;

//DB config - connect to DB
db.mongoose
  .connect(connection_url, {
    //parameters for smooth connection
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

const dbLive = mongoose.connection;

dbLive.on("error", console.error.bind(console, "Connection Error:"));

io.sockets.once("connection", (socket) => {
  console.log("Socket.io connection established!");
  //sendData(socket);
});

function sendData(socket) {
  parser.once("data", (data) => {
    const sensorsDataObj = {
      //user using product
      username: "user",
      ...JSON.parse(data),
    };

    //update user data with sensor values realtime
    dbLive
      .collection("users")
      .updateOne({ username: "user" }, { $set: { data: sensorsDataObj } });

    // sensors data sent with socket
    console.log(sensorsDataObj);

    io.emit("message", sensorsDataObj);

    setTimeout(() => {
      sendData(socket);
    }, 500);
  });
}

//delete users
//dbb.collection("users").deleteOne({_id: "6079433ab00f9d2128ee8cad"});

//API endpoints -> router
app.use("/", router);
authenticationRoutes(router);
userRoutes(router);

//listen
server.listen(3006, () => console.log("Server is running"));

//add roles
const initial = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
};
