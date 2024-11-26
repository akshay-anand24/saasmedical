import React, { useRef, useState, useEffect } from "react";
import "./ImageViewer.css";

function ImageViewer({ onZoomIn, onZoomOut, onCrop }) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1); // Initial zoom scale
  const [cropStart, setCropStart] = useState(null); // Starting point of crop
  const [cropEnd, setCropEnd] = useState(null); // Ending point of crop
  const [isCropping, setIsCropping] = useState(false); // Whether cropping mode is active

  // Handles file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          setImage(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to apply scaling
  const applyCanvasTransform = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current context state
    ctx.save();

    // Apply scale (zoom) and adjust the canvas size
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Update the canvas size to match the scaled image size
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw the scaled image on the canvas
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    // Restore context state
    ctx.restore();
  };

  // Zoom in function
  const zoomIn = () => {
    setScale((prevScale) => prevScale * 1.2); // Zoom in by 20%
  };

  // Zoom out function
  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.2, 0.1)); // Prevent zooming out below 0.1x
  };

  // Start crop selection
  const startCrop = (e) => {
    if (!isCropping) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    setCropStart({ x: startX, y: startY });
    setCropEnd(null);
  };

  // Update crop selection
  const updateCrop = (e) => {
    if (!isCropping || !cropStart) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    setCropEnd({ x: endX, y: endY });
  };

  // Finish crop and apply the crop
  const finishCrop = () => {
    if (!cropStart || !cropEnd) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);

    // Crop the image area
    const imageData = ctx.getImageData(x, y, width, height);
    
    // Clear the canvas and draw the cropped area
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(imageData, 0, 0);
    setIsCropping(false);
    setCropStart(null);
    setCropEnd(null);
  };

  // Trigger applyCanvasTransform whenever scale changes
  useEffect(() => {
    if (image) {
      applyCanvasTransform();
    }
  }, [scale, image]);

  // Pass control functions to the Toolbar via props
  useEffect(() => {
    if (onZoomIn) onZoomIn(zoomIn);
    if (onZoomOut) onZoomOut(zoomOut);
    if (onCrop) onCrop(activateCrop);
  }, [onZoomIn, onZoomOut, onCrop]);

  // Activate crop mode
  const activateCrop = () => {
    setIsCropping(true); // Enable cropping mode
  };

  return (
    <div className="image-viewer">
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileUpload}
        className="file-input"
      />
      <div
        className="image-container"
        onMouseDown={startCrop}
        onMouseMove={updateCrop}
        onMouseUp={finishCrop}
      >
        <canvas ref={canvasRef} className={`image-canvas ${isCropping ? "crop-active" : ""}`}></canvas>
        {isCropping && cropStart && cropEnd && (
          <div
            className="crop-rectangle"
            style={{
              position: 'absolute',
              left: Math.min(cropStart.x, cropEnd.x),
              top: Math.min(cropStart.y, cropEnd.y),
              width: Math.abs(cropStart.x - cropEnd.x),
              height: Math.abs(cropStart.y - cropEnd.y),
              border: '2px dashed red',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ImageViewer;
