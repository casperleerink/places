import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
  zIndex: 0,
};

const center = {
  lat: 0,
  lng: 0,
};
const options = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
};

function MyGoogleMap({ zoom }) {
  return (
    <LoadScript googleMapsApiKey="AIzaSyB2HeqAZLnqha_R-fmHwZZNVUC5vjK3l6s">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        clickableIcons={false}
        options={options}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MyGoogleMap);
