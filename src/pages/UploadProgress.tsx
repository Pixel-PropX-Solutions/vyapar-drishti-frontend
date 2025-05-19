import { useState } from "react";
import axios from "axios";
import { LinearProgress, Typography, Box } from "@mui/material";

const FileUpload = () => {
  const [progress, setProgress] = useState(0);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      },
    });
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
      <input type="file" onChange={handleUpload} />
      {progress > 0 && (
        <>
          <Typography variant="h6">Uploading... {progress}%</Typography>
          <LinearProgress variant="determinate" value={progress} />
        </>
      )}
    </Box>
  );
};

export default FileUpload;
