import React, { useRef, useEffect } from "react";

function Dropfile({ callback, children }) {
  const dropRef = useRef(null);
  useEffect(() => {
    let div = dropRef.current;
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[0].kind === "file") {
          const file = e.dataTransfer.items[0].getAsFile();
          callback(file); //send file to parent
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        const file = e.dataTransfer.files[0];
        callback(file); //send file to parent
      }
    };
    div.addEventListener("dragover", handleDrag);
    div.addEventListener("drop", handleDrop);
    return () => {
      div.removeEventListener("dragover", handleDrag);
      div.removeEventListener("drop", handleDrop);
    };
  }, [callback]);
  return <div ref={dropRef}>{children}</div>;
}

export default Dropfile;
