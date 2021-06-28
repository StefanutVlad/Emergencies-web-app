import React from "react";

const CookiesNotice = () => {
  return (
    <div className="help-content-cookies">
      <h1>About Cookies</h1>
      <p className="lead"></p>
      <p>
        We use cookies and similar tools (collectively, "cookies") for the
        purposes described below.
      </p>
      <p>
        <strong> Operational Cookies</strong> : We use cookies to provide our
        services, for example:
      </p>
      <ul>
        <li>
          <span className="a-list-item">
            Recognising you when you sign-in to use our services.
          </span>
        </li>
        <li>
          <span className="a-list-item">
            Recognising if you are a user, moderator or administrator and
            providing other customised features and services.
          </span>
        </li>
        <li>
          <span className="a-list-item">
            Displaying features and services which might be of interest to you,
            including ads on our services if they are for products and services
            available on Emergency System.
          </span>
        </li>
        <li>
          <span className="a-list-item">
            Keeping track of your sensor data.
          </span>
        </li>
        <li>
          <span className="a-list-item">Preventing fraudulent activity.</span>
        </li>
        <li>
          <span className="a-list-item">Improving security.</span>
        </li>
      </ul>
    </div>
  );
};

export default CookiesNotice;
