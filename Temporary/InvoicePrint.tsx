import React, { useRef, useState } from "react";
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
    Snackbar,
    Alert,
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
} from "@mui/icons-material";

type Props = {
    invoiceHtml: string;
    open: boolean;
    onClose: () => void;
    invoiceNumber?: string;
    customerName?: string;
};

const InvoicePrint: React.FC<Props> = ({
    invoiceHtml,
    onClose,
    open,
    invoiceNumber = "INV-001",
    customerName = "Customer"
}) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    const [isGenerating, setIsGenerating] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const generatePDF = async (): Promise<Blob> => {
        if (!invoiceRef.current) throw new Error('Invoice content not found');

        const element = invoiceRef.current.cloneNode(true) as HTMLElement;
        console.log('Generating PDF for invoice:', invoiceNumber);

        // Temporarily append to body for proper rendering
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '0';
        element.style.width = '210mm'; // A4 width
        document.body.appendChild(element);

        try {
            const pdf = await html2pdf()
                .set({
                    margin: [10, 10, 10, 10],
                    filename: `invoice-${invoiceNumber}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'a4',
                        orientation: 'portrait',
                        compress: true
                    },
                })
                .from(element)
                .outputPdf('blob');


            console.log('PDF generated successfully:', pdf);

            return pdf;
        } finally {
            document.body.removeChild(element);
        }
    };

    const handleDownload = async () => {
        try {
            setIsGenerating(true);
            const pdfBlob = await generatePDF();
            console.log('PDF Blob created:', pdfBlob);
            const url = URL.createObjectURL(pdfBlob);
            console.log('PDF Blob URL created:', url);
            const link = document.createElement('a');
            console.log('Creating download link for invoice:', link);
            link.href = url;
            link.download = `invoice-${invoiceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showSnackbar('Invoice downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            // showSnackbar('Failed to download invoice', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        if (!invoiceRef.current) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showSnackbar('Please allow popups to print', 'error');
            return;
        }

        const printContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice ${invoiceNumber}</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        @media print {
                            body { margin: 0; padding: 0; }
                            .no-print { display: none !important; }
                        }
                    </style>
                </head>
                <body>
                    ${invoiceHtml}
                </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };

        showSnackbar('Print dialog opened');
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                setIsGenerating(true);
                const pdfBlob = await generatePDF();
                const file = new File([pdfBlob], `invoice-${invoiceNumber}.pdf`, { type: 'application/pdf' });

                await navigator.share({
                    title: `Invoice ${invoiceNumber}`,
                    text: `Invoice for ${customerName}`,
                    files: [file]
                });

                showSnackbar('Invoice shared successfully!');
            } else {
                // Fallback: Copy link or download
                await handleDownload();
                showSnackbar('Invoice downloaded (sharing not supported)', 'info');
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
                showSnackbar('Failed to share invoice', 'error');
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
                        p: { xs: 2, md: 4 },
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
                                minHeight: '297mm', // A4 height
                            }}
                        >
                            <div
                                ref={invoiceRef}
                                dangerouslySetInnerHTML={{ __html: invoiceHtml }}
                            />
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
            </Drawer>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default InvoicePrint;