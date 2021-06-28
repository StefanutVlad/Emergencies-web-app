import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import useGeoLocation from "../useGeoLocation";

const Map = ({ sensorsData }) => {
  //hooks
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const [id, setId] = useState(0);
  const [markers, setMarkers] = useState({});

  const location = useGeoLocation();

  const [dir, setDir] = useState();

  const [patientDistance, setPatientDistance] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [patientDuration, setPatientDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [toggle, setToggle] = useState(false);

  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [zoom, setZoom] = useState(8);

  //map container props to avoid rerenders
  const mapContainerStyle = {
    width: "100%",
    height: "35vh",
  };

  //default romania
  const romaniaCoords = {
    lat: 45.9433,
    lng: 24.9662,
  };

  const [centerMap, setCenter] = useState(romaniaCoords);

  const hospitalCoordinates = {
    lat: 46.765651,
    lng: 23.583325,
  };

  //disable map controls
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const getPatientLocation = () => {
    let patientWaypoint = {};

    const sensorLocationLat = sensorsData.map((user) => user.Latitude).join("");
    const sensorLocationLng = sensorsData
      .map((user) => user.Longitude)
      .join("");
    const geolocationLat = location.coordinates.lat;
    const geolocationLng = location.coordinates.lng;

    if (sensorLocationLat != 0.0 && sensorLocationLng != 0.0) {
      patientWaypoint = [sensorLocationLat, sensorLocationLng];
    } else if (sensorLocationLat == 0.0 && sensorLocationLng == 0.0) {
      patientWaypoint = [geolocationLat, geolocationLng];
    }

    return patientWaypoint;
  };
  console.log(
    "Current Latitude: " +
      getPatientLocation()[0] +
      " Current Longitude:" +
      getPatientLocation()[1]
  );

  const places = [
    //ambulance info
    {
      id: "Ambulance location",
      info: "Departing place of Emergency medical staff",
      pos: {
        lat: hospitalCoordinates.lat + 0.0002,
        lng: hospitalCoordinates.lng + 0.000075,
      },
      url: "/ambulanceMarker.png",
    },
    //patient info
    {
      id: "Patient location",
      info: "Patient place",
      pos: {
        lat: parseFloat(getPatientLocation()[0]),
        lng: parseFloat(getPatientLocation()[1]),
        //lat: sensorsData.Latitude,
        //lng: sensorsData.Longitude,
      },
      url: "/patientMarker.png",
    },
    //location info
    {
      id: "Hospital location",
      info: "Arriving at the hospital place",
      pos: {
        lat: hospitalCoordinates.lat + 0.0000495,
        lng: hospitalCoordinates.lng + 0.000164,
      },
      url: "/hospitalMarker.png",
    },
  ];

  const markerLoadHandler = (marker, place) => {
    // Create a mapping of our places to actual Marker objects
    return setMarkers((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // set the place state
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected. not allowed to have 2 info windows opened
    if (infoOpen) {
      setInfoOpen(false);
    }

    //open info window
    setInfoOpen(true);

    // zoom in on marker click
    if (zoom < 13) {
      setZoom(16);
    }

    // center the selected Marker
    setCenter(place.pos);
  };

  const mapClickEvent = (event) => {
    setId((id) => (id = 0));
    setToggle(true);
    onDirClick();

    for (let i = 0; i < 3; i++) {
      setMarkers(() => [
        {
          time: new Date(),
          id: setId((id) => id + 1),
        },
      ]);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (
        patientDistance &&
        totalDistance &&
        patientDuration &&
        totalDuration
      ) {
        // console.log(
        //   "Distance & Duration have updated",
        //    patientDistance,
        //    patientDuration
        // );
      }
    }

    return () => (mounted = false);
  }, [patientDistance, totalDistance, patientDuration, totalDuration]);

  //callback to optimize directions path with real-time data & prevent unwanted renders
  const onDirClick = useCallback(
    (map) => {
      let mounted = true;

      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      const directionsService = new window.google.maps.DirectionsService();

      const directionsRequest = {
        origin: new window.google.maps.LatLng(
          hospitalCoordinates.lat + 0.00025,
          hospitalCoordinates.lng + 0.00025
        ),
        destination: new window.google.maps.LatLng(
          hospitalCoordinates.lat,
          hospitalCoordinates.lng
        ),
        waypoints: [
          {
            location: new window.google.maps.LatLng(
              Object.values(getPatientLocation())[0],
              Object.values(getPatientLocation())[1]
              // sensorsData.map((user) => user.Latitude).join(""),
              // sensorsData.map((user) => user.Longitude).join("")
            ),
          },
        ],
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      };

      if (mounted || sensorsData.map((user) => user.Fall) == "1") {
        directionsRenderer.setMap(null);
        directionsService.route(directionsRequest, (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            var leg = response.routes[0].legs[0];
            let tempTotalDistance = 0;
            let tempTotalDuration = 0;

            for (let i = 0; i < 2; i++) {
              tempTotalDistance += response.routes[0].legs[i].distance.value;
              tempTotalDuration += response.routes[0].legs[i].duration.value;
            }

            // save the path to state
            setDir(response);
            // the distance in km
            setTotalDistance((tempTotalDistance / 1000).toFixed(2));
            setPatientDistance((leg.distance.value / 1000).toFixed(2));

            setPatientDuration((leg.duration.value / 60).toFixed(2));
            setTotalDuration((tempTotalDuration / 60).toFixed(2));

            console.log("coords: " + status + " setdirections: " + response);
          } else {
            console.log(
              "Directions request failed. Status: " +
                status +
                " Response: " +
                response
            );

            //delete route from map
            directionsRenderer.setDirections({ routes: [] });
          }
        });
      }
      // return () => (mounted = false);
    },
    [
      location.coordinates.lat,
      location.coordinates.lng,
      Object.values(getPatientLocation())[0],
      Object.values(getPatientLocation())[1],
    ]
  );

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps...";

  return (
    <div>
      <GoogleMap
        onLoad={onMapLoad}
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={centerMap}
        options={options}
      >
        {toggle &&
          places.map((place) => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={(marker) => markerLoadHandler(marker, place)}
              onClick={(event) => markerClickHandler(event, place)}
              icon={{
                url: place.url,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          ))}

        <DirectionsRenderer
          directions={dir}
          geodesic={true}
          options={{
            strokeColor: "#ff2343",
            strokeOpacity: 0.8,
            strokeWeight: 5,
            clickable: true,
            draggable: false,
            suppressInfoWindows: false,
            suppressMarkers: true,
          }}
        />
        {infoOpen && selectedPlace && (
          <InfoWindow
            anchor={markers[selectedPlace.id]}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div>
              <h3>{selectedPlace.id}</h3>
              <div>{selectedPlace.info}</div>
              <div>
                Coordinates: ({selectedPlace.pos.lat}, {selectedPlace.pos.lng})
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <button
        className="btn btn-dark "
        style={{ backgroundColor: markers ? "blue" : null }}
        onClick={(event) => mapClickEvent(event)}
      >
        Fall
      </button>
      <button
        className="btn btn-dark"
        style={{ backgroundColor: markers ? "red" : null }}
        type="button"
        onClick={() => {
          setToggle(0);
          setCenter(romaniaCoords);
          setZoom(7);
          setMarkers();
          setId((id) => (id = 0));
          setDir({ routes: [] });
          setPatientDistance((distance) => (distance = 0));
          setTotalDistance((distance) => (distance = 0));
          setPatientDuration((duration) => (duration = 0));
          setTotalDuration((duration) => (duration = 0));
        }}
      >
        CLEAR MAP
      </button>
      <br />
      <h6>Current points of interest: {id}</h6>
      <br />
      <h6>Patient distance: {patientDistance} km</h6>
      <h6>Total distance: {totalDistance} km</h6>
      <h6>Patient Duration: {patientDuration} minutes</h6>
      <h6>Total Duration: {totalDuration} minutes</h6>
    </div>
  );
};

export default Map;
