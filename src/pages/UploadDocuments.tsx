import * as React from "react";
import { useState, useCallback, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  Button,
  Typography,
  Box,
  Paper,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from "@mui/icons-material/Close";
import { TextSnippet } from "@mui/icons-material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InfoIcon from "@mui/icons-material/Info";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { DocumentUploadLoader } from "@/common/Loader";
import userApi from "@/api/api";
// import { setInvoiceData } from "@/store/reducers/invoiceReducer";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { AIThinkingIndicator } from "@/common/AIThinkingIndicator";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

interface FilePreviewProps {
  file: File;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
    setPageNumber(1);
  }

  React.useEffect(() => {
    if (file.type === "application/pdf") {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsText(file);
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const renderPreview = () => {
    if (file.type === "application/pdf" && previewUrl) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          <Document
            file={previewUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            loading={<Typography>Loading PDF...</Typography>}
            error={<Typography color="error">Failed to load PDF</Typography>}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={Math.min(window.innerWidth * 0.7, 800)}
            />
          </Document>

          {numPages > 1 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IconButton
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <Typography variant="body2">
                  Page {pageNumber} of {numPages}
                </Typography>
                <IconButton
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= numPages}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
        }}
      >
        <TextSnippet sx={{ fontSize: 100, color: "action.active" }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Preview Not Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This file type is not supported for preview
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="file-preview-title"
    >
      <DialogTitle id="file-preview-title">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PictureAsPdfIcon color="primary" />
            <Typography variant="h6">{file.name}</Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close preview"
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {renderPreview()}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            icon={<InfoIcon />}
            label={`${(file.size / 1024).toFixed(1)} KB`}
            variant="outlined"
            size="small"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default function UploadDocuments() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showUploadLoader, setShowUploadLoader] = useState(true);

  const [dragOver, setDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const processFile = useCallback((newFile: File) => {
    if (newFile.size > 10 * 1024 * 1024) {
      setError(`File exceeds 10MB limit`);
      return;
    }

    if (newFile.type !== 'application/pdf') {
      setError(`Only PDF files are allowed`);
      return;
    }

    setFile(newFile);
    setError("");
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]); // Only process the first file
    }
  }, [processFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFile(event.target.files[0]);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFilePreview = () => {
    if (file) setPreviewFile(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      setShowUploadLoader(true);
      setIsThinking(false);

      const response = await userApi.post(
        `/extraction/file/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setUploadProgress(percent);

          // When upload reaches 100%, switch to thinking mode after a short delay
          if (percent === 100) {
            // Delay to ensure upload progress animation completes
            setTimeout(() => {
              setShowUploadLoader(false);
              setIsThinking(true);
            }, 500);
          }
        }
      });

      console.log("Upload response", response.data);
      if (response.data.success === true) {
        setUploadComplete(true);
        setError("");
        // dispatch(setInvoiceData(response.data.data));

        // Give time for the AI thinking indicator to show its completion message
        setTimeout(() => {
          navigate("/invoice");
        }, 2000);
      }
    } catch (error) {
      setError("Upload failed. Please try again.");
      console.error(error);
      setIsUploading(false);
      setShowUploadLoader(true);
      setIsThinking(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError("");
    setUploadComplete(false);
    setUploadProgress(0);
    setIsUploading(false);
    setShowUploadLoader(true);
    setIsThinking(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        minHeight: "calc(100vh - 110px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        margin: "0 auto",
      }}
    >
      <Paper
        elevation={dragOver ? 6 : 3}
        sx={{
          padding: 4,
          width: "100%",
          border: dragOver ? "2px dashed #1976d2" : "2px dashed #a0a0a0",
          borderRadius: 1,
          transition: "all 0.3s ease",
          transform: dragOver ? "scale(1.02)" : "scale(1)",
          position: 'relative',
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: dragOver ? "#1976d2" : "text.primary",
            transition: "color 0.3s ease",
            fontWeight: 500,
          }}
        >
          Upload Document
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 3 }}
        >
          Drag and drop a PDF file here or click to select
        </Typography>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
          accept="application/pdf" // Restrict to PDF files
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            gap: 2
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={triggerFileInput}
            // disabled={isUploading}
            sx={{ minWidth: 140 }}
          >
            Select PDF
          </Button>

          {file && !isUploading && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearFile}
              sx={{ minWidth: 120 }}
            >
              Clear
            </Button>
          )}
        </Box>

        {file && !isUploading && !uploadComplete && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <PictureAsPdfIcon color="primary" fontSize="large" />
              </Grid>
              <Grid item xs>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(1)} KB`}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Preview file">
                  <IconButton
                    onClick={handleFilePreview}
                    disabled={isUploading}
                  >
                    <PreviewIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        )}

        {isUploading && file && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 4 }}>
            {showUploadLoader && (
              <DocumentUploadLoader
                isUploading={isUploading}
                progress={uploadProgress}
                fileName={file.name}
                fileSize={file.size}
                error={error}
              />
            )}

            {isThinking && (
              <AIThinkingIndicator
                isThinking={isThinking}
                onComplete={() => {
                  setIsThinking(false);
                  setUploadComplete(true);
                }}
                finalResponse={`The invoice is fully analyzed and the text is successfully extracted. AI may make mistakes. Before proceeding please check the data carefully.`}
              />
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploading || !file}
            sx={{
              minWidth: 200,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(25, 118, 210, 0.5)",
                color: "#fff",
                cursor: "not-allowed",
                opacity: 0.7,
              },
            }}
          >
            {isUploading ? "Processing..." : "Upload Document"}
          </Button>
        </Box>

        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Max file size: 10MB | PDF files only
        </Typography>
      </Paper>

      {/* File Preview Dialog */}
      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </Box>
  );
}
