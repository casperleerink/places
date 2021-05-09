import React, { useState, useCallback } from "react";
import MainMap from "./MainMap";
import Search from "./Search";
import ShowItem from "./ShowItem";

function Main() {
  const [currentItem, setCurrentItem] = useState(null);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const handleMarkerClick = useCallback(
    (data) => {
      setCurrentItem(data);
    },
    [setCurrentItem]
  );
  return (
    <main style={{ height: "100vh" }}>
      {currentItem && (
        <ShowItem data={currentItem} onClose={() => setCurrentItem(null)} />
      )}
      <Search
        onChange={(v) => setSearch(v)}
        value={search}
        handleSearchBy={(o) => setSearchBy(o)}
      />
      <MainMap
        onMarkerClick={handleMarkerClick}
        search={search}
        searchBy={searchBy}
      />
    </main>
  );
}

export default Main;
