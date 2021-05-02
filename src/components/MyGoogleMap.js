import React, { useContext, useState, useEffect } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import Spinner from "react-bootstrap/Spinner";
import { UserContext } from "./UserContext";

function MyGoogleMap({
  zoom,
  containerStyle,
  onClick,
  children,
  gestureHandling = "auto",
  center = null,
}) {
  const { location } = useContext(UserContext);
  const [currentCenter, setCurrentCenter] = useState(center ? center : null);
  useEffect(() => {
    setCurrentCenter(center);
  }, [center]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB2HeqAZLnqha_R-fmHwZZNVUC5vjK3l6s",
    mapIds: ["6cb9e1d27b1a6a35"],
  });
  const options = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling,
    mapId: "6cb9e1d27b1a6a35",
  };
  function handleCenterChange() {
    const center = this.getCenter();

    if (
      !currentCenter ||
      currentCenter.lat !== center.lat() ||
      currentCenter.lng !== center.lng()
    ) {
      setCurrentCenter({ lat: center.lat(), lng: center.lng() });
    }
  }
  if (isLoaded) {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter ? currentCenter : location}
        zoom={zoom}
        clickableIcons={false}
        options={options}
        onClick={onClick}
        onCenterChanged={handleCenterChange}
      >
        {children}
      </GoogleMap>
    );
  } else if (loadError) {
    return <div>Error while loading map </div>;
  } else {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
}

export default React.memo(MyGoogleMap);
