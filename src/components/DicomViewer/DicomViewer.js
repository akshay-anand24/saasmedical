import React, { useRef, useEffect, useState } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import "./DicomViewer.css";

// Configure cornerstone WADO image loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

function DicomViewer({ onZoomIn, onZoomOut, onCrop }) {
  const dicomElementRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false); // Track if drawing crop area
  const [cropArea, setCropArea] = useState(null); // Store the crop area dimensions

  useEffect(() => {
    if (dicomElementRef.current) {
      cornerstone.enable(dicomElementRef.current);
    }

    return () => {
      if (dicomElementRef.current) {
        cornerstone.disable(dicomElementRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected. Please upload a valid DICOM (.dcm) file.");
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    try {
      const image = await cornerstone.loadImage(`wadouri:${fileUrl}`);
      cornerstone.displayImage(dicomElementRef.current, image);
    } catch (error) {
      console.error("Error loading DICOM file:", error.message);
      alert(`Failed to load DICOM file: ${error.message}`);
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomFactor = 0.1;
    setScale((prevScale) => Math.max(0.5, prevScale + (event.deltaY < 0 ? zoomFactor : -zoomFactor)));
  };

  const handleMouseDown = (event) => {
    if (drawing) {
      const startX = event.clientX;
      const startY = event.clientY;
      setStartPosition({ x: startX, y: startY });
      setCropArea(null); // Reset crop area when starting new crop
    } else {
      setDragging(true);
      setStartPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      setTranslate((prevTranslate) => ({
        x: prevTranslate.x + event.clientX - startPosition.x,
        y: prevTranslate.y + event.clientY - startPosition.y,
      }));
      setStartPosition({ x: event.clientX, y: event.clientY });
    } else if (drawing) {
      const width = event.clientX - startPosition.x;
      const height = event.clientY - startPosition.y;
      setCropArea({
        x: Math.min(startPosition.x, event.clientX),
        y: Math.min(startPosition.y, event.clientY),
        width: Math.abs(width),
        height: Math.abs(height),
      });
    }
  };

  const handleMouseUp = () => {
    if (drawing && cropArea) {
      // Trigger the crop action with the area captured
      onCrop(cropArea); // Pass crop area to parent when crop is finalized
    }
    setDrawing(false); // End drawing state
    setDragging(false);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, 4)); // Limit zoom-in scale to 4x
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.2, 0.5)); // Limit zoom-out scale to 0.5x
  };

  // Passing the zoom handlers to the parent (Toolbar)
  useEffect(() => {
    if (onZoomIn) {
      onZoomIn(zoomIn);
    }
    if (onZoomOut) {
      onZoomOut(zoomOut);
    }
  }, [onZoomIn, onZoomOut]);

  // Handle crop button click to enable drawing mode
  const handleCropButtonClick = () => {
    setDrawing(true); // Enable crop mode
  };

  return (
    <div className="dicom-viewer">
      <h1>DICOM Viewer</h1>
      <input
        type="file"
        accept=".dcm"
        onChange={handleFileUpload}
        className="dicom-file-input"
      />
      
      <div
        ref={dicomElementRef}
        className="dicom-container"
        style={{
          width: "512px",
          height: "512px",
          background: "black",
          border: "1px solid white",
          overflow: "auto", // Enable scrolling if the image is zoomed in too much
          transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
          cursor: dragging ? "grabbing" : "grab",
          position: "relative", // Make sure crop is on top of the image
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Display the crop area */}
        {cropArea && (
          <div
            style={{
              position: "absolute",
              top: cropArea.y,
              left: cropArea.x,
              width: cropArea.width,
              height: cropArea.height,
              border: "2px dashed red",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default DicomViewer;
