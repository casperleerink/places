import React, { useCallback } from "react";
import MyGoogleMap from "./MyGoogleMap";
// import { UserContext } from "./UserContext";
import { Marker } from "@react-google-maps/api";
import style from "../styles/LocationField.module.scss";

const containerStyle = {
  width: "100%",
  height: "400px",
};
function LocationField({ loc, onMapClick, center = null }) {
  const handleMapClick = useCallback(
    (e) => {
      const l = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      onMapClick(l);
    },
    [onMapClick]
  );
  return (
    <div>
      <p className={style["location-label"]}>Location*</p>
      <MyGoogleMap
        zoom={6}
        containerStyle={containerStyle}
        onClick={handleMapClick}
        gestureHandling="cooperative"
        center={center ? center : null}
      >
        {loc && (
          <Marker position={loc} draggable={true} onDragEnd={handleMapClick} />
        )}
      </MyGoogleMap>
    </div>
  );
}

export default LocationField;
