import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer pt-5 mt-5">
      <hr className="horizontal dark mb-5" />
      <div className="container-footer">
        <div className="row justify-content-center">
          <div className="col-md-8 mb-3">
            <div>
              <h2 className="text-gradient text-footer footer-font-weight-bolder">
                Emergency System
              </h2>
            </div>
            <div>
              <h6 className="mt-3 mb-2 opacity-8 social-footer">Social</h6>
              <ul className="d-flex flex-row ms-n3 social">
                <li className="social-item">
                  <Link to={"/"} className="social-link pe-1">
                    <FontAwesomeIcon
                      icon={faFacebook}
                      className="text-lg text-white opacity-8"
                      aria-hidden="true"
                    ></FontAwesomeIcon>
                  </Link>
                </li>
                <li className="social-item">
                  <Link to={"/"} className="social-link pe-1">
                    <FontAwesomeIcon
                      icon={faTwitter}
                      className="twitt text-lg text-white  opacity-8"
                      aria-hidden="true"
                    ></FontAwesomeIcon>
                  </Link>
                </li>
                <li className="social-item">
                  <Link to={"/"} className="social-link pe-1">
                    <FontAwesomeIcon
                      icon={faGoogle}
                      className="text-lg text-white  opacity-8"
                      aria-hidden="true"
                    ></FontAwesomeIcon>
                  </Link>
                </li>
                <li className="social-item">
                  <Link to={"/"} className="social-link pe-1">
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="text-lg text-white  opacity-8"
                      aria-hidden="true"
                    ></FontAwesomeIcon>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="row-md-3 mb-3">
              <span className="auth-footer-seperator"></span>
              <div className="d-flex flex-row social">
                <Link
                  to={"/help/user/ConditionsOfUse"}
                  className="text-white footer-link "
                >
                  Conditions of Use
                </Link>
                <span className="auth-footer-seperator"></span>

                <Link
                  to={"/help/user/PrivacyNotice"}
                  className="text-white footer-link "
                >
                  Privacy Notice
                </Link>

                <span className="auth-footer-seperator"></span>

                <Link
                  to={"/help/user/CookiesNotice"}
                  className="text-white footer-link "
                >
                  Cookies Notice
                </Link>
              </div>
              <span className="auth-footer-seperator"></span>
            </div>
          </div>

          <div className="col-12">
            <div className="text-center">
              <p className="my-4 text-white text-sm">
                All rights reserved. Copyright ©
                <script>document.write(new Date().getFullYear())</script>2021
                Emergency System by Vlad Antonio Ștefănuț.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
