import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { login } from "../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Login = (props) => {
  //hooks
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.AuthReducer);
  const { message } = useSelector((state) => state.MessageReducer);

  const mountedRef = useRef(false);

  // effect just for tracking loanding mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    //event prevents refreshing the page
    e.preventDefault();

    setLoading(true);
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      // dispatch login action(auth.js) to Redux Thunk Middleware
      dispatch(login(username, password))
        .then(() => {
          if (mountedRef.current) {
            setLoading(false);
            props.history.push("/profile");
            window.location.reload();
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="text-center">Sign-in</h1>
        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <h5 htmlFor="username">Username</h5>
            <Input
              type="text"
              name="username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
              className={"form_username"}
            />
          </div>

          <div className="form-group">
            <h5 htmlFor="password">Password</h5>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
              className={"form_password"}
            />
          </div>

          <div className="row d-flex justify-content-center">
            <div className="sign-in-button-reg">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}{" "}
                Sign In
              </button>
            </div>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>

        <div className="a-divider a-divider-break">
          <h5>New to Emergency System?</h5>
        </div>
        <button className="btn btn-dark btn-block  mr-auto  ">
          <Link to={"/register"} className="register_link">
            <li className="register_text">
              Create your Emergency system Account
            </li>
          </Link>
        </button>
        <p>
          By signing-in you agree to Emergency system's Conditions of Use.
          Please see out Privacy Notice and our Cookies Notice.
        </p>
      </div>

      <div className="a-section a-spacing-top-extra-large auth-footer">
        <div className="a-divider a-divider-section">
          <div className="a-divider-inner"></div>
        </div>

        <div className="a-section a-spacing-small a-text-center a-size-mini">
          <span className="auth-footer-seperator"></span>

          <Link to={"/help/user/ConditionsOfUse"} className="register_link">
            Conditions of Use
          </Link>
          <span className="auth-footer-seperator"></span>

          <Link to={"/help/user/PrivacyNotice"} className="register_link">
            Privacy Notice
          </Link>

          <span className="auth-footer-seperator"></span>

          <Link to={"/help/user/CookiesNotice"} className="register_link">
            Cookies Notice
          </Link>
          <span className="auth-footer-seperator"></span>
        </div>

        <div className="a-section a-spacing-none a-text-center">
          <span className="a-size-mini a-color-secondary">
            © 2021, Emergency System, Inc. or its affiliates
          </span>
        </div>
      </div>
    </div>
  );
};
export default Login;
