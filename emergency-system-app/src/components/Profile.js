import React from "react";
import ShowData from "./ShowData";
import Map from "./Map";
import { useParams } from "react-router";

const Profile = ({ currentUser, sensorsData }) => {
  const currentId = useParams();

  return (
    <div className="container-profile">
      <h1>Your data</h1>
      <header>
        <ShowData
          currentId={currentId}
          currentUser={currentUser}
          sensorsData={sensorsData}
          className="sensor-data"
        />
        <Map sensorsData={sensorsData} className="google-map" />
      </header>
    </div>
  );
};

export default Profile;
