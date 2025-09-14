import React, { useState } from "react";
import theme from "@/theme";
import {
    Drawer,
    Box,
    alpha,
    IconButton,
    Typography,
    Button,
    Stack,
    Tooltip,
    CircularProgress,
    useMediaQuery,
    useTheme,
    Paper,
    Toolbar,
    AppBar,
} from "@mui/material";
import {
    Close as CloseIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Share as ShareIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    NavigateBeforeOutlined,
    NavigateNextOutlined,
    TextSnippet,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};


type Props = {
    file: File;
    open: boolean;
    onClose: () => void;
    invoiceNumber?: string;
    customerName?: string;
};

const InvoicePrint: React.FC<Props> = ({
    file,
    open,
    onClose,
    invoiceNumber = "",
    customerName = ""
}) => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const [isGenerating, setIsGenerating] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        setPageNumber(1);
    }

    const handleDownload = async () => {
        try {
            setIsGenerating(true);
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${invoiceNumber}-vyapar-drishti.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Invoice downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download invoice');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        const url = URL.createObjectURL(file);

        // Open the PDF in a new tab/window so the browser's native PDF viewer can be used.
        const printWindow = window.open(url, '_blank', 'noopener');

        if (!printWindow) {
            toast.error('Unable to open print window. Please allow popups to print.');
            URL.revokeObjectURL(url);
            return;
        }

        try { printWindow.focus(); } catch { /* ignore */ }

        let attempts = 0;
        const maxAttempts = 8;

        const attemptPrint = () => {
            attempts += 1;
            try {
                printWindow.print();
                // Revoke the object URL shortly after initiating print
                setTimeout(() => {
                    try { URL.revokeObjectURL(url); } catch { /* ignore */ }
                }, 1500);
            } catch {
                if (attempts < maxAttempts) {
                    setTimeout(attemptPrint, 500);
                } else {
                    toast.error('Automatic print failed. Please print from the opened PDF window.');
                    setTimeout(() => {
                        try { URL.revokeObjectURL(url); } catch { /* ignore */ }
                    }, 2000);
                }
            }
        };

        // Prefer to trigger print once the new window loads, with a fallback retry.
        printWindow.onload = attemptPrint;
        setTimeout(attemptPrint, 1200);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                setIsGenerating(true);
                const file1 = new File([file], `${invoiceNumber}-vyapar-drishti.pdf`, { type: 'application/pdf' });

                toast.promise(navigator.share({
                    title: `Invoice ${invoiceNumber}`,
                    text: `Invoice for ${customerName}`,
                    files: [file1]
                }), {
                    loading: 'Opening Sharing window...',
                    success: 'Invoice sharing opened successfully!',
                    error: 'Failed to open sharing window.'
                });
            } else {
                // Fallback: Copy link or download
                await handleDownload();
                toast.error('Invoice downloaded (sharing not supported)');
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
                toast.error('Failed to share invoice');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

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

    return (
        <>
            <Drawer
                anchor="right"
                PaperProps={{
                    sx: {
                        width: isFullscreen ? '100vw' : { xs: '100%', md: '80%', lg: '70%' },
                        backgroundColor: theme.palette.background.default,
                        backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(12px)',
                    }
                }}
                open={open}
                onClose={onClose}
            >
                {/* Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(10px)',
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                >
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    mr: 2
                                }}
                            >
                                Invoice Preview
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                {invoiceNumber} • {customerName}
                            </Typography>
                        </Box>

                        {/* Page Controls */}
                        {numPages > 1 && <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                            <IconButton
                                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                disabled={pageNumber <= 1}
                            >
                                <NavigateBeforeOutlined />
                            </IconButton>

                            <Typography variant="body2" sx={{
                                minWidth: 40,
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: theme.palette.text.secondary
                            }}>
                                Page {pageNumber} of {numPages}
                            </Typography>
                            <IconButton
                                onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                                disabled={pageNumber >= numPages}
                            >
                                <NavigateNextOutlined />
                            </IconButton>
                        </Stack>}

                        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                            <IconButton onClick={toggleFullscreen} sx={{ mr: 1 }}>
                                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Close">
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    backgroundColor: alpha(theme.palette.grey[100], 0.3),
                    '&::-webkit-scrollbar': {
                        width: 8,
                        height: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha(theme.palette.background.default, 0.1),
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.5),
                        }
                    }
                }}>
                    <Box sx={{
                        py: 2,
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Paper
                            elevation={8}
                            sx={{
                                backgroundColor: '#ffffff',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            }}
                        >
                            {/* Render Invoice HTML of page {page} */}
                            {file.type === "application/pdf" && previewUrl ?
                                (<Document
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
                                        scale={1.0}
                                    />
                                </Document>) :
                                (
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
                                )}
                        </Paper>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Paper
                    elevation={8}
                    sx={{
                        p: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: 'blur(10px)',
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    {isMobile ? (
                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />}
                                onClick={handleDownload}
                                disabled={isGenerating}
                                fullWidth
                                size="large"
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 2
                                }}
                            >
                                {isGenerating ? 'Generating...' : 'Download PDF'}
                            </Button>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<PrintIcon />}
                                    onClick={handlePrint}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2
                                    }}
                                >
                                    Print
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={isGenerating ? <CircularProgress size={20} /> : <ShareIcon />}
                                    onClick={handleShare}
                                    disabled={isGenerating}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2
                                    }}
                                >
                                    Share
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <DownloadIcon />}
                                onClick={handleDownload}
                                disabled={isGenerating}
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    minWidth: 160
                                }}
                            >
                                {isGenerating ? 'Generating...' : 'Download PDF'}
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={handlePrint}
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    minWidth: 120
                                }}
                            >
                                Print
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <ShareIcon />}
                                onClick={handleShare}
                                disabled={isGenerating}
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    minWidth: 120
                                }}
                            >
                                Share
                            </Button>
                        </Stack>
                    )}
                </Paper>
            </Drawer >
        </>
    );
};

export default InvoicePrint;