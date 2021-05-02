import { useState, useEffect } from "react";
import {
  query,
  orderBy,
  startAt,
  endAt,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { geohashQueryBounds, distanceBetween } from "geofire-common";

export default function useGeoQuery(center, radius) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const bounds = geohashQueryBounds(center, radius);
    const promises = [];
    for (const b of bounds) {
      const q = query(
        collection(db, "items"),
        orderBy("geohash"),
        startAt(b[0]),
        endAt(b[1])
      );
      promises.push(getDocs(q));
    }
    // Collect all the query results together into a single list
    Promise.all(promises)
      .then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const { latitude, longitude } = doc.get("location");

            // We have to filter out a few false positives due to GeoHash accuracy
            const distanceInKm = distanceBetween([latitude, longitude], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radius) {
              matchingDocs.push(doc);
            }
          }
        }

        return matchingDocs;
      })
      .then((matchingDocs) => {
        if (isMounted) {
          setDocs(matchingDocs);
        }
      });
    return () => (isMounted = false);
  }, [center, radius]);

  return docs;
}
