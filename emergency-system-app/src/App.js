import React, { useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { history } from "./helpers/history";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import Header from "./components/Header";
import Footer from "./components/Footer";

import ConditionsOfUse from "./components/help/ConditionsOfUse";
import PrivacyNotice from "./components/help/PrivacyNotice";
import CookiesNotice from "./components/help/CookiesNotice";

const App = () => {
  const [sensorsData, setUsersData] = useState([]);
  const socket = io.connect("http://localhost:3006");
  const { user: currentUser } = useSelector((state) => state.AuthReducer);

  socket.on("connect", () => {
    if (socket.connected) {
      // console.log("connected to the socket client");
    }
  });

  useEffect(() => {
    socket.once("message", (newData) => {
      setUsersData([sensorsData, newData]);
    });
  }, [sensorsData, socket]);
  //console.log("sens: " + sensorsData.map(user => user.Latitude));

  return (
    <Router history={history}>
      <Header currentUser={currentUser} />

      <Switch>
        <Route exact path={["/", "/home"]}>
          <Home currentUser={currentUser} sensorsData={sensorsData} />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route path="/profile">
          <BoardUser currentUser={currentUser} />
        </Route>

        <Route path="/userBoard/:userId">
          <Profile
            currentUser={currentUser}
            sensorsData={sensorsData}
          ></Profile>
        </Route>
        <Route path="/modBoard">
          <BoardModerator />
        </Route>
        <Route path="/adminPannel">
          <BoardAdmin currentUser={currentUser} />
        </Route>

        <Route path="/help/user/ConditionsOfUse">
          <ConditionsOfUse />
        </Route>
        <Route path="/help/user/PrivacyNotice">
          <PrivacyNotice />
        </Route>
        <Route path="/help/user/CookiesNotice">
          <CookiesNotice />
        </Route>
      </Switch>

      <Footer />
    </Router>
  );
};

export default App;
