import React, { useState } from "react";
import MainMap from "./MainMap";
import ShowItem from "./ShowItem";
function Main() {
  const [currentItem, setCurrentItem] = useState(null);
  const handleMarkerClick = (data) => {
    setCurrentItem(data);
  };
  return (
    <main style={{ height: "100vh" }}>
      {currentItem && (
        <ShowItem data={currentItem} onClose={() => setCurrentItem(null)} />
      )}
      <MainMap onMarkerClick={handleMarkerClick} />
    </main>
  );
}

export default Main;
