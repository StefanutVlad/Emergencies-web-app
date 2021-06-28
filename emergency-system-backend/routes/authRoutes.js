// Authentication:
// POST / api / auth / signup;
// POST / api / auth / signin;

import verifySignUp from "../middlewares/verifySignUp.js";
import controller from "../controllers/authController.js";
import Users from "../models/dbUserData.js";

const authenticationRoutes = (router) => {
  router.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //endpoint to add the data into the DB
  router.post("/user/data", (req, res) => {
    const dbData = req.body;

    Users.create(dbData, (err, data) => {
      if (err) {
        //internal server error
        res.status(500).send(err);
      } else {
        //data created successfully
        res.status(201).send(data);
      }
    });
  });

  router.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  router.post("/api/auth/signin", controller.signin);
};

export default authenticationRoutes;
