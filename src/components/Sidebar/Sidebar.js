import React from "react";
import "./Sidebar.css";

function Sidebar({ onViewChange }) {
  return (
    <aside className="sidebar">
      <ul>
        <li onClick={() => onViewChange("image")}>Image Viewer</li>
        <li onClick={() => onViewChange("dicom")}>DICOM Viewer</li>
      </ul>
    </aside>
  );
}

export default Sidebar;
