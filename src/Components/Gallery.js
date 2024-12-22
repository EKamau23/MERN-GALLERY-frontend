import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Container, Button, Typography, Paper, TextField, Grid, IconButton } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import UploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/GetApp';

function Gallery() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]); // Changed to an array to handle multiple files
  const [previewUrls, setPreviewUrls] = useState([]); // Changed to store multiple preview URLs
  const [fullImageUrl, setFullImageUrl] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/gallery/folders`)
      .then((response) => {
        setFolders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching folders", error);
      });
  }, []);

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") return;
    axios
      .post(`${API_BASE_URL}/api/gallery/create-folder`, { name: newFolderName })
      .then((response) => {
        setFolders([...folders, response.data]);
        setNewFolderName("");
      })
      .catch((error) => {
        console.error("Error creating folder", error);
      });
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId);
    axios
      .get(`${API_BASE_URL}/api/gallery/folder/${folderId}/photos`)
      .then((response) => {
        setUploadedFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching photos", error);
      });
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    console.log("Selected Files:", selectedFiles);  // Log selected files to ensure they are properly captured

    // Restrict to a maximum of 30 files
    if (selectedFiles.length + filesToUpload.length <= 30) {
      setFilesToUpload((prevFiles) => [
        ...prevFiles,
        ...Array.from(selectedFiles),
      ]);
      const newPreviews = Array.from(selectedFiles).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
    } else {
      alert("You can upload a maximum of 30 files.");
    }
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });
    
    console.log("Uploading Files:", formData); // Log the FormData to ensure it's constructed properly
    
    axios
      .post(`${API_BASE_URL}/api/gallery/upload/${selectedFolder}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Upload Success:", response.data);  // Log success response
        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          ...response.data,
        ]);
        setFilesToUpload([]); // Clear the files after successful upload
        setPreviewUrls([]); // Clear preview URLs
      })
      .catch((error) => {
        console.error("Error uploading photos", error.response?.data || error.message);  // Log error message
      });
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/photos/photo/${photoId}`);
      setUploadedFiles(uploadedFiles.filter(file => file._id !== photoId));
    } catch (error) {
      console.error("Error deleting photo:", error.response?.data || error.message);
    }
  };

  const handleDownloadPhoto = (photoId) => {
    axios
      .get(`${API_BASE_URL}/api/gallery/download/${photoId}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "photo.jpg");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading photo:", error);
      });
  };

  const handleGoBackToGallery = () => {
    setSelectedFolder(null);
  };

  const handleImageClick = (url) => {
    setFullImageUrl(`${API_BASE_URL}${url}`);
  };

  const closeFullImage = () => {
    setFullImageUrl(null);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: "20px" }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#FDECEC' }}>
        <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
          Gallery
        </Typography>

        {selectedFolder === null ? (
          <Box>
            <Typography variant="h5" color="secondary" gutterBottom>
              All Folders
            </Typography>
            <Grid container spacing={3}>
              {folders.map((folder) => (
                <Grid item xs={12} sm={6} md={4} key={folder._id}>
                  <Paper
                    sx={{
                      padding: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: "#FFB6B9",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                    onClick={() => handleFolderClick(folder._id)}
                  >
                    <FolderIcon sx={{ fontSize: 40, color: "#fff", marginBottom: 2 }} />
                    <Typography variant="h6" color="white">{folder.name}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box textAlign="center" mt={3}>
              <TextField
                label="New Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ marginRight: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FolderIcon />}
                onClick={handleCreateFolder}
              >
                Create Folder
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Button variant="outlined" onClick={handleGoBackToGallery} sx={{ marginBottom: 3 }}>
              Back to Gallery
            </Button>
            <Typography variant="h5" color="primary" gutterBottom>
              Folder: {folders.find((folder) => folder._id === selectedFolder)?.name}
            </Typography>

            <Box sx={{ marginTop: 4 }} textAlign="center">
              {previewUrls.length > 0 && (
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="h6" color="textSecondary">Previews</Typography>
                  <Grid container spacing={2}>
                    {previewUrls.slice(0, 30).map((url, index) => (
                      <Grid item xs={4} sm={3} md={2} key={index}>
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                multiple // Enable multiple file selection
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<UploadIcon />}
                onClick={handleFileUpload}
                disabled={filesToUpload.length === 0 || filesToUpload.length > 30}
              >
                Upload Photos
              </Button>
            </Box>

            <Typography variant="h6" color="secondary" gutterBottom>
              Uploaded Photos
            </Typography>
            <Grid container spacing={3}>
              {uploadedFiles.length === 0 ? (
                <Typography>No photos uploaded yet!</Typography>
              ) : (
                uploadedFiles.map((file) => (
                  <Grid item xs={12} sm={6} md={4} key={file._id}>
                    <Paper sx={{ textAlign: "center", padding: 2 }}>
                      <img
                        src={`${API_BASE_URL}${file.url}`}
                        alt={file.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(file.url)}
                      />
                      <Box sx={{ marginTop: 2 }}>
                        <IconButton
                          color="error"
                          onClick={() => handleDeletePhoto(file._id)}
                          sx={{ marginRight: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleDownloadPhoto(file._id)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
      </Paper>

      {fullImageUrl && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeFullImage}
        >
          <img src={fullImageUrl} alt="Full View" style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </Box>
      )}
    </Container>
  );
}

export default Gallery;
