import React, { useState } from "react";
import html2pdf from "html2pdf.js";
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
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    NavigateBeforeOutlined,
    NavigateNextOutlined,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import IframeRenderer from "@/common/IframeRenderer";

type Props = {
    invoiceHtml: Array<{ html: string, page_number: number }>;
    fullHtml: string;
    downloadHtml: string;
    open: boolean;
    onClose: () => void;
    invoiceNumber?: string;
    customerName?: string;
};

const InvoicePrint: React.FC<Props> = ({
    invoiceHtml,
    fullHtml,
    downloadHtml,
    onClose,
    open,
    invoiceNumber = "",
    customerName = ""
}) => {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const [isGenerating, setIsGenerating] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const generatePDF = async (): Promise<Blob> => {
        if (!downloadHtml) throw new Error('Invoice content not found');

        // const element = invoiceRef.current;
        try {
            const pdf = await html2pdf()
                .set({
                    margin: 0,
                    filename: `${invoiceNumber}-vyapar-drishti.pdf`,
                    html2canvas: {
                        scale: 3,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: '#ffffff'
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'A4',
                        orientation: 'portrait',
                        compress: false
                    },
                })
                .from(downloadHtml)
                .outputPdf('blob');

            return pdf;
        } finally {
            // document.body.removeChild(element);
        }
    };



    const handleDownload = async () => {
        try {
            setIsGenerating(true);
            const pdfBlob = await generatePDF();
            const url = URL.createObjectURL(pdfBlob);
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
        if (!fullHtml) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Please allow popups to print.');
            return;
        }

        const printContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice ${invoiceNumber}</title>
                    <style>
                        body { margin: 0; padding: 0px; font-family: Arial, sans-serif; }
                        @media print {
                            body { margin: 0; padding: 0; }
                            .no-print { display: none !important; }
                        }
                    </style>
                </head>
                <body>
                    ${fullHtml}
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                setIsGenerating(true);
                const pdfBlob = await generatePDF();
                const file = new File([pdfBlob], `${invoiceNumber}-vyapar-drishti.pdf`, { type: 'application/pdf' });

                toast.promise(navigator.share({
                    title: `Invoice ${invoiceNumber}`,
                    text: `Invoice for ${customerName}`,
                    files: [file]
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

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 2));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

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
                        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
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
                                Page {pageNumber} of {invoiceHtml?.length}
                            </Typography>
                            <IconButton
                                onClick={() => setPageNumber(prev => Math.min(prev + 1, invoiceHtml?.length))}
                                disabled={pageNumber >= invoiceHtml?.length}
                            >
                                <NavigateNextOutlined />
                            </IconButton>
                        </Stack>

                        {/* Zoom Controls */}
                        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                            <Tooltip title="Zoom Out">
                                <IconButton
                                    onClick={handleZoomOut}
                                    disabled={zoom <= 0.5}
                                    size="small"
                                >
                                    <ZoomOutIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography
                                variant="body2"
                                sx={{
                                    minWidth: 40,
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: theme.palette.text.secondary
                                }}
                            >
                                {Math.round(zoom * 100)}%
                            </Typography>
                            <Tooltip title="Zoom In">
                                <IconButton
                                    onClick={handleZoomIn}
                                    disabled={zoom >= 2}
                                    size="small"
                                >
                                    <ZoomInIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>

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
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: '100%'
                    }}>
                        <Paper
                            elevation={8}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 1,
                                padding: 2,
                                overflow: 'hidden',
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top center',
                                transition: 'transform 0.2s ease-in-out',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                                maxWidth: '210mm',
                                width: '100%',
                                minHeight: '300mm',
                            }}
                        >
                            {/* Render Invoice HTML of page {page} */}
                            {invoiceHtml?.length > 0 ? (
                                <IframeRenderer htmlString={invoiceHtml.find(page => page.page_number === pageNumber)?.html ?? ''} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No invoice data available.
                                </Typography>
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