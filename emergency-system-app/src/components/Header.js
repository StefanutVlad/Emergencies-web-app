import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/auth";
import { clearMessage } from "../actions/message";
import { history } from "../helpers/history";

const Header = ({ currentUser, sensorsData }) => {
  //hooks
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      // clear message when changing location
      dispatch(clearMessage());
    });
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <div className="presentation-page">
      <div className="container position-sticky z-index-sticky col-12">
        <nav className="margin-left-right navbar navbar-expand-lg  blur blur-rounded top-0 z-index-fixed shadow position-absolute my-3 py-2 start-0 end-0 mx-4 ">
          <div className="container-fluid">
            <Link
              to={"/"}
              className="text-gradient text-nav-primary font-weight-bolder ms-sm-3 "
            >
              Emergency System
            </Link>

            <button
              className="navbar-toggler shadow-none ms-2 collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navigation"
              aria-controls="navigation"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon mt-2">
                <span className="navbar-toggler-bar bar1"></span>
                <span className="navbar-toggler-bar bar2"></span>
                <span className="navbar-toggler-bar bar3"></span>
              </span>
            </button>

            <div
              className="navbar-collapse pt-2 pb-2 py-lg-0 collapse"
              id="navigation"
            >
              <ul className="navbar-nav navbar-nav-hover ps-lg-5 w-100 ">
                <li className="nav-item mx-2">
                  <Link to={"/home"} className="nav-link">
                    Home
                  </Link>
                </li>

                {currentUser ? (
                  <div className="navbar-collapse">
                    <div className="navbar-nav-hover">
                      {currentUser.roles == "ROLE_USER" ? (
                        <li className="nav-item-user mx-2">
                          <Link
                            to={`/userBoard/${currentUser.username}`}
                            className="nav-link"
                          >
                            {currentUser.username} Board
                          </Link>
                        </li>
                      ) : (
                        <li className="nav-item-admin  mx-2">
                          <Link
                            to={`/userBoard/${currentUser.username}`}
                            className="nav-link "
                          >
                            {currentUser.username} Board
                          </Link>
                        </li>
                      )}

                      {showModeratorBoard && (
                        <li className="nav-item mx-2">
                          <Link to={"/modBoard"} className="nav-link">
                            Moderator Board
                          </Link>
                        </li>
                      )}

                      {showAdminBoard && (
                        <li className="nav-item-admin-board mx-2">
                          <Link to={"/adminPannel"} className="nav-link ">
                            Admin Pannel
                          </Link>
                        </li>
                      )}
                    </div>

                    <div className="navbar-nav ms-lg-auto">
                      <li className="nav-item ms-lg-auto mx-2">
                        <Link to={"/profile"} className="nav-link">
                          {currentUser.username}
                        </Link>
                      </li>
                      <li className="nav-item ms-lg-auto mx-2">
                        <a href="/login" className="nav-link" onClick={logOut}>
                          LogOut
                        </a>
                      </li>
                    </div>
                  </div>
                ) : (
                  <div className="nav-item ms-lg-auto mx-2">
                    <li>
                      <Link to={"/login"} className="nav-link">
                        Login
                      </Link>
                    </li>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <header className="bg-gradient-dark">
        <div className="page-header section-height-75">
          <span className="mask bg-gradient-info opacity-8 bg"></span>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center mx-auto my-auto mt-5">
                <h4 className="h1 text-white">Emergency System</h4>
                <p className="lead mb-4 text-white opacity-8">
                  Emergencies automation system and monitoring of vulnerable
                  people
                </p>

                {!isLoggedIn ? (
                  <button type="submit" className="btn-account text-dark">
                    <Link to={"/register"} className="btn-texxt">
                      Create Account
                    </Link>
                  </button>
                ) : (
                  <h4 className="text-white">
                    Welcome, {currentUser.username}{" "}
                  </h4>
                )}
              </div>
            </div>
          </div>

          <div className="position-absolute w-100 z-index-1 bottom-0">
            <svg
              className="waves"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 24 150 40"
              preserveAspectRatio="none"
              shapeRendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                ></path>
              </defs>
              <g className="moving-waves">
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="-1"
                  fill="rgba(255,255,255,0.40"
                ></use>
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="3"
                  fill="rgba(255,255,255,0.35)"
                ></use>
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="5"
                  fill="rgba(255,255,255,0.25)"
                ></use>
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="8"
                  fill="rgba(255,255,255,0.20)"
                ></use>
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="13"
                  fill="rgba(255,255,255,0.15)"
                ></use>
                <use
                  xlinkHref="#gentle-wave"
                  x="48"
                  y="16"
                  fill="rgba(255,255,255,1"
                ></use>
              </g>
            </svg>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
