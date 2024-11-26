
# DICOM Medical Imaging Viewer

## Introduction
The DICOM Viewer is an intuitive and user-friendly web application built using React and Cornerstone.js. It provides functionalities like zooming, panning, and cropping of DICOM images, making it useful for medical professionals to examine images interactively.

## Features
- **Zoom In/Out**: The user can zoom in and out on the DICOM images using a toolbar or mouse wheel scroll.
- **Drag to Pan**: Allows users to navigate around the image when zoomed in.
- **Image Cropping**: Focus on specific areas by cropping the image.
- **File Upload**: Easily upload DICOM files.
- **Responsive UI**: Adaptable to various screen sizes.

## Technologies Used
- **React**: For building the user interface.
- **Cornerstone.js**: For handling and rendering DICOM images.
- **Cornerstone WADO Image Loader**: To load DICOM files in various formats.
- **dicom-parser**: For parsing DICOM file metadata.
- **CSS**: Styling for components.

## Installation
### Prerequisites
- Node.js (version 14.x or higher)
- npm (Node package manager)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate into the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the development server:
   ```bash
   npm start
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Folder Structure
- `src/`: Contains the source code.
  - `components/`: Includes all React components.
  - `DicomViewer/`: Component for displaying and interacting with DICOM images.
  - `Toolbar/`: Includes tools like zoom and crop.
  - `Header/, Footer/, Sidebar/`: Layout components.

## Running the Project Locally
1. Install dependencies as mentioned above.
2. Start the application:
   ```bash
   npm start
   ```

## Building for Production
To create an optimized production build:
```bash
npm run build
```

## Deploying to Netlify
1. Push the project to a GitHub repository.
2. Log into Netlify and create a new site from Git.
3. Configure deployment settings:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
4. Deploy the site @ https://saasmedical.netlify.app/.

## Contributing
Contributions are welcome! Steps to contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit and push changes:
   ```bash
   git commit -am 'Add new feature'
   git push origin feature-branch
   ```
4. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
