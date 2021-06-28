import React, { useState, useEffect } from "react";
import axios from "../axios";
import useGeoLocation from "../useGeoLocation";

const ShowData = ({ currentId, currentUser, sensorsData }) => {
  const location = useGeoLocation();
  const [userIds, setUserIds] = useState([]);
  let patientWaypoint = {};
  //const currentId = useParams();

  const getPatientLocation = () => {
    const userLatitude = sensorsData.map((user) => user.Latitude).join("");
    const userLongitude = sensorsData.map((user) => user.Longitude).join("");
    const geolocationLatitude = location.coordinates.lat;
    const geolocationLongitude = location.coordinates.lng;

    if (userLatitude != 0.0 && userLongitude != 0.0) {
      patientWaypoint = {
        userLatitude,
        userLongitude,
      };
    } else {
      patientWaypoint = {
        geolocationLatitude,
        geolocationLongitude,
      };
    }
    return patientWaypoint;
  };

  useEffect(() => {
    axios.get(`/user/data`).then((response) => {
      const usersId = response.data;
      console.log(usersId);
      setUserIds(usersId);
    });
  }, []);

  return (
    <div>
      {/* 443: USER ; 444: admin*/}
      {/* sensors set on user */}

      {/* SHOW SENSORS DATA */}

      {/* {sensorsData.map(
        (user, i) =>
          user.username && (
            <div key={i}>
              <h5>Name: {user.username} </h5>
              {/* <h5>Role: {currentUser.roles}</h5> */}
      {/* <h5>BPM: {user.BPM}</h5>
              <h5>Temperature: {user.Temperature}</h5>
              <h5>Latitude: {Object.values(getPatientLocation())[0]}</h5>
              <h5>Longitude: {Object.values(getPatientLocation())[1]}</h5>
              <h5>Fall Detection: {user.Fall}</h5>
              <br />
            </div>
          )
      )}  */}

      {userIds
        .filter((users) => users.username === currentId.userId)
        .map((users, index) => (
          <div key={index}>
            <h5>Name: {users.username} </h5>
            {/* <h5>Role: {currentUser.roles}</h5> */}
            {users.roles == "607866abfb62783a986f2443" ? (
              <h5>Role: ROLE_USER</h5>
            ) : (
              <h5>Role: ROLE_ADMIN</h5>
            )}
            <h5>BPM: {users.BPM}</h5>
            <h5>Temperature: {users.Temperature}</h5>
            <h5>Latitude: {Object.values(getPatientLocation())[0]}</h5>
            <h5>Longitude: {Object.values(getPatientLocation())[1]}</h5>
            <h5>Fall Detection: {users.Fall}</h5>
            <br />
          </div>
        ))}
      <br />
      <br />
    </div>
  );
};
export default ShowData;
