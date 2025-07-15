import * as React from "react";
import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Chip,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import InfoIcon from "@mui/icons-material/Info";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { TextSnippet } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";


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

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
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
        let objectUrl: string | null = null;
        if (file.type === "application/pdf") {
            objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else if (file.type.startsWith("text/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsText(file);
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    const changePage = (offset: number) => {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    };

    const renderPreview = () => {
        if (file.type === "application/pdf" && previewUrl) {
            return (
                <Box
                    sx={{
                        // display: "flex",
                        // flexDirection: "column",
                        // alignItems: "center",
                        p: 0,
                        border: "1px solid #ccc",
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
                            renderMode="canvas"
                            width={Math.min(window.innerWidth * 0.7, 800)}
                            scale={1.0}
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
