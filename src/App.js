import React, { useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ImageViewer from "./components/ImageViewer/ImageViewer";
import DicomViewer from "./components/DicomViewer/DicomViewer";
import Toolbar from "./components/Toolbar/Toolbar";
import Footer from "./components/Footer/Footer";

function App() {
  const [viewMode, setViewMode] = useState("image"); // "image" or "dicom"
  const zoomInRef = useRef();
  const zoomOutRef = useRef();
  const cropRef = useRef();

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar onViewChange={setViewMode} />
        <div className="main-content">
          <Toolbar
            onZoomIn={() => zoomInRef.current?.()}
            onZoomOut={() => zoomOutRef.current?.()}
            onCrop={() => cropRef.current?.()}
          />
          {viewMode === "image" ? (
            <ImageViewer
              onZoomIn={(fn) => (zoomInRef.current = fn)}
              onZoomOut={(fn) => (zoomOutRef.current = fn)}
              onCrop={(fn) => (cropRef.current = fn)}
            />
          ) : (
            <DicomViewer
              onZoomIn={(fn) => (zoomInRef.current = fn)}
              onZoomOut={(fn) => (zoomOutRef.current = fn)}
              onCrop={(fn) => (cropRef.current = fn)}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
