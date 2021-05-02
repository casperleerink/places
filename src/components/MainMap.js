import React, { useState, useEffect } from "react";
import MyGoogleMap from "./MyGoogleMap";
import { Marker } from "@react-google-maps/api";
// import { UserContext } from "./UserContext";
import { query, collection } from "firebase/firestore";
import { db, getDocuments } from "../hooks/firebase";
// import { geohashQueryBounds, distanceBetween } from "geofire-common";

function MainMap({ onMarkerClick }) {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const q = query(collection(db, "items"));

    getDocuments(q)
      .then((results) => {
        setDocs(results);
      })
      .catch((e) => {
        setError(`Failed to get photos from server: ${e.code}`);
      });
    // const center = [userPosition.lat, userPosition.lng];
    // const radius = 1000 * 1000;
    // let isMounted = true;
    // const bounds = geohashQueryBounds(center, radius);
    // const promises = [];
    // for (const b of bounds) {
    //   const q = query(
    //     collection(db, "items"),
    //     orderBy("geohash"),
    //     startAt(b[0]),
    //     endAt(b[1])
    //   );
    //   promises.push(getDocs(q));
    // }
    // // Collect all the query results together into a single list
    // Promise.all(promises)
    //   .then((snapshots) => {
    //     const matchingDocs = [];

    //     for (const snap of snapshots) {
    //       for (const doc of snap.docs) {
    //         const { latitude, longitude } = doc.get("location");

    //         // We have to filter out a few false positives due to GeoHash accuracy
    //         const distance = distanceBetween([latitude, longitude], center);
    //         if (distance <= radius) {
    //           matchingDocs.push(doc);
    //         }
    //       }
    //     }
    //     return matchingDocs;
    //   })
    //   .then((matchingDocs) => {
    //     if (isMounted) {
    //       setDocs(matchingDocs);
    //     }
    //   });
    // return () => (isMounted = false);
  }, []);

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };
  const handleMapClick = (e) => {
    //go to upload new image with these coords if logged in, otherwise show user should login/signup first.
    //How to get arguments to the account page from here??
    //maybe should do this on double click only?
    console.log(e.latLng.lat(), e.latLng.lng());
  };
  const Markers = () => {
    return docs.map((doc) => {
      const data = doc.data;
      return (
        <Marker
          key={doc.id}
          onClick={() => onMarkerClick(data)}
          title={data.title}
          position={{
            lat: data.location.latitude,
            lng: data.location.longitude,
          }}
          icon={data.thumbUrl}
        />
      );
    });
  };

  return (
    <>
      {error && <h1>{error}</h1>}
      <MyGoogleMap
        zoom={6}
        containerStyle={containerStyle}
        onClick={handleMapClick}
      >
        <Markers />
      </MyGoogleMap>
    </>
  );
}

export default MainMap;
