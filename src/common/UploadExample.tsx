import { Box } from "@mui/material";
import { useState } from "react";
import { DocumentUploadLoader } from "./loaders/Loader";

// Usage example component
const DocumentUploadExample: React.FC = () => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | undefined>(undefined);
    
    // Simulate file upload
    const simulateUpload = () => {
      setIsUploading(true);
      setProgress(0);
      setError(undefined);
      
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 10;
          
          // Simulate random error
          if (Math.random() > 0.95 && prevProgress < 90) {
            clearInterval(interval);
            setError("Connection lost. Please try again.");
            return prevProgress;
          }
          
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          return newProgress;
        });
      }, 300);
    };
    
    const handleComplete = () => {
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 2000);
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 4 }}>
        <button
          onClick={simulateUpload}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Start Upload Simulation
        </button>
        
        <DocumentUploadLoader
          isUploading={isUploading}
          progress={progress}
          fileName="important-document.pdf"
          fileSize={3500000}
          error={error}
          onComplete={handleComplete}
        />
      </Box>
    );
  };
  
  export default DocumentUploadExample;