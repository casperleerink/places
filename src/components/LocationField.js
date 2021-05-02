import React from "react";
import MyGoogleMap from "./MyGoogleMap";
// import { UserContext } from "./UserContext";
import { Marker } from "@react-google-maps/api";
import style from "../styles/LocationField.module.scss";

function LocationField({ loc, onMapClick, center = null }) {
  const handleMapClick = (e) => {
    const l = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    onMapClick(l);
  };
  return (
    <div>
      <p className={style["location-label"]}>Location*</p>
      <MyGoogleMap
        zoom={6}
        containerStyle={{
          width: "100%",
          height: "400px",
        }}
        onClick={handleMapClick}
        gestureHandling="cooperative"
        center={center ? center : null}
      >
        {loc && <Marker position={loc} draggable={true} />}
      </MyGoogleMap>
    </div>
  );
}

export default LocationField;
