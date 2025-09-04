import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import html2pdf from "html2pdf.js";
import toast from 'react-hot-toast';
import { alpha, AppBar, Box, Button, CircularProgress, Drawer, IconButton, Paper, Stack, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close, Download, Fullscreen, FullscreenExit, NavigateBeforeOutlined, NavigateNextOutlined, Print, Share, ZoomIn, ZoomOut } from '@mui/icons-material';
import IframeRenderer from '../IframeRenderer';

type InitProps = {
    html: string[],
    downloadHtml: string,
    pdfName: string,
    title?: string
}

type PDFModalProps = { visible: boolean; setVisible: Dispatch<SetStateAction<boolean>> }

type RetrunType = {
    init: (props: InitProps, callback?: () => void) => void
    isGenerating: boolean,
    setIsGenerating: Dispatch<SetStateAction<boolean>>,
    handleDownload: () => void,
    handleShare: () => void,
    handlePrint: () => void,
    PDFViewModal: ({ visible, setVisible }: PDFModalProps) => React.JSX.Element,
}

export default function usePDFHandler(): RetrunType {

    const theme = useTheme();
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [data, setData] = useState<InitProps>({ html: [], downloadHtml: '', pdfName: '', title: '' })
    const isReady = useRef<boolean>(false);


    function init(props: InitProps, callback?: () => void) {
        setData(props);
        if (callback) callback()
    }



    const generatePDF = async (): Promise<{ blob: Blob, file: File }> => {
        try {
            if (!isReady.current) throw new Error('pdf genrator is not ready !!!');

            setIsGenerating(true)
            const pdf = await html2pdf()
                .set({
                    margin: [5, 0, 0, 0],
                    filename: `${data.pdfName}.pdf`,
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
                .from(data.downloadHtml)
                .outputPdf('blob');

            const file = new File([pdf], `${data.pdfName}.pdf`, { type: 'application/pdf' });

            console.log('PDF file generated with name:', file.name);
            if (!file) {
                console.error('PDF generation failed. File path is empty.');
                return { blob: new Blob(), file: new File([], '') };
            }
            return { blob: new Blob(), file: file };
        } catch (error) {
            console.error('Error generating PDF:', error);
            return { blob: new Blob(), file: new File([], '') };
        } finally {
            setIsGenerating(false);
        }
    };



    const handleDownload = async () => {
        if (!isReady.current) return;
        try {
            setIsGenerating(true);
            const { blob, file } = await generatePDF();
            if (!blob || !file) {
                console.error('PDF generation failed. No blob or file returned.');
                return;
            }
            console.log('PDF generated successfully:', file);

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${data.pdfName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log('Download initiated for:', link.download);

        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };



    const handlePrint = async () => {
        if (!isReady.current) return;
        try {
            setIsGenerating(true);
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                toast.error('Please allow popups to print.');
                return;
            }

            const printContent = data.downloadHtml;

            printWindow.document.write(printContent);
            printWindow.document.close();

            printWindow.onload = () => {
                printWindow.print();
                printWindow.close();
            };

        } catch (error) {
            console.error('Error generating PDF for printing:', error);
        } finally {
            setIsGenerating(false);
        }
    };



    const handleShare = async () => {
        if (!isReady.current) return;
        try {
            setIsGenerating(true);
            const { blob } = await generatePDF();
            const file = new File([blob], `${data.pdfName}.pdf`, { type: 'application/pdf' });

            toast.promise(navigator.share({
                title: `Invoice ${data.pdfName}`,
                text: `Invoice for ${data.title}`,
                files: [file]
            }), {
                loading: 'Opening Sharing window...',
                success: 'Invoice sharing opened successfully!',
                error: 'Failed to open sharing window.'
            });
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
            }
        } finally {
            setIsGenerating(false);
        }
    };


    function PDFViewModal({ visible, setVisible }: PDFModalProps): React.JSX.Element {
        const muiTheme = useTheme();
        const [pageNo, setPageNo] = useState<number>(0);
        const [zoom, setZoom] = useState(1);
        const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
        const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

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
                open={visible}
                onClose={() => setVisible(false)}
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
                                {data.title}
                            </Typography>
                        </Box>

                        {/* Page Controls */}
                        <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                            <IconButton
                                onClick={() => setPageNo(prev => Math.max(prev - 1, 1))}
                                disabled={pageNo <= 1}
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
                                Page {pageNo} of {data.html?.length}
                            </Typography>
                            <IconButton
                                onClick={() => setPageNo(prev => Math.min(prev + 1, data.html?.length))}
                                disabled={pageNo >= data.html?.length}
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
                                    <ZoomOut />
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
                                    <ZoomIn />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                            <IconButton onClick={toggleFullscreen} sx={{ mr: 1 }}>
                                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Close">
                            <IconButton onClick={() => setVisible(false)}>
                                <Close />
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
                            {data.html?.length > 0 ? (
                                <IframeRenderer htmlString={data.html[pageNo] ?? ''} />
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
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <Download />}
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
                                    startIcon={<Print />}
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
                                    startIcon={isGenerating ? <CircularProgress size={20} /> : <Share />}
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
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <Download />}
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
                                startIcon={<Print />}
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
                                startIcon={isGenerating ? <CircularProgress size={20} /> : <Share />}
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
        )
    }



    useEffect(() => {
        isReady.current = (
            data.html.length > 0 &&
            data.downloadHtml !== '' &&
            data.pdfName !== ''
        )
    }, [data])

    return {
        setIsGenerating,
        handleDownload,
        isGenerating, 
        PDFViewModal,
        handlePrint,
        handleShare,
        init
    }
}