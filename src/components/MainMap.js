import React, { useState, useEffect, useCallback } from "react";
import MyGoogleMap from "./MyGoogleMap";
import { Marker } from "@react-google-maps/api";
// import { UserContext } from "./UserContext";
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../hooks/firebase";
// import { geohashQueryBounds, distanceBetween } from "geofire-common";

//hard coded, so it doesn't re-render maps.
const containerStyle = {
  width: "100%",
  height: "100vh",
};

function MainMap({ onMarkerClick, search, searchBy }) {
  const [docs, setDocs] = useState([]);
  const [searchedDocs, setSearchedDocs] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const currentDocs = [];
      querySnapshot.forEach((doc) => {
        currentDocs.push({ data: doc.data(), id: doc.id });
      });
      setDocs(currentDocs);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (search && docs.length && searchBy) {
      const filteredDocs = docs.filter((doc) => {
        if (!doc.data[searchBy]) {
          return false;
        }
        const string = doc.data[searchBy].toLowerCase();
        const substring = search.toLowerCase();
        return string.includes(substring);
      });
      setSearchedDocs(filteredDocs);
      return;
    }
    setSearchedDocs(docs);
  }, [search, searchBy, docs]);
  const handleMapClick = useCallback((e) => {
    //TODO
    //go to upload new image with these coords if logged in, otherwise show user should login/signup first.
    //How to get arguments to the account page from here??
    //maybe should do this on double click only?
    console.log(e.latLng.lat(), e.latLng.lng());
  }, []);
  const Markers = useCallback(() => {
    return searchedDocs.map((doc) => {
      const data = doc.data;
      return (
        <Marker
          key={doc.id}
          onClick={() => onMarkerClick(data)}
          title={data.title}
          position={data.location}
          icon={data.thumbUrl}
        />
      );
    });
  }, [searchedDocs, onMarkerClick]);

  return (
    <MyGoogleMap
      zoom={6}
      containerStyle={containerStyle}
      onClick={handleMapClick}
    >
      <Markers />
    </MyGoogleMap>
  );
}

export default MainMap;
