import React from "react";
import "./Toolbar.css";

function Toolbar({ onZoomIn, onZoomOut, onBrightnessIncrease, onBrightnessDecrease, onCrop }) {
  return (
    <div className="toolbar">
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
      <button onClick={onCrop}>Crop</button>
    </div>
  );
}

export default Toolbar;
