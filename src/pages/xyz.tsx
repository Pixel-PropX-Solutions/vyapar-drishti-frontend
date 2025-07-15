import html2pdf from "html2pdf.js";
import {
    Box,
    Button,
} from "@mui/material";
import toast from "react-hot-toast";
import { html } from "@/internals/data/html";
import { FilePreview } from "@/common/FilePreview";
import React from "react";

const Xyz = () => {

    const [file, setFile] = React.useState<File | null>(null);
    const generatePDF = async (): Promise<Blob> => {
        if (!html) throw new Error('Invoice content not found');

        // const element = invoiceRef.current;
        try {
            const pdf = await html2pdf()
                .set({
                    margin: 0,
                    filename: `INV-001-vyapar-drishti.pdf`,
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
                .from(html)
                .outputPdf('blob');


            const blob = new Blob([pdf], { type: 'application/pdf' });
            const fileName = `INV-001-vyapar-drishti.pdf`;
            const file1 = new File([blob], fileName, { type: 'application/pdf' });
            setFile(file1);
            return pdf;
        } finally {
            // document.body.removeChild(element);
        }
    };



    const handleDownload = async () => {
        try {
            // setIsGenerating(true);
            await generatePDF();
            // const pdfBlob = await generatePDF();
            // const url = URL.createObjectURL(pdfBlob);
            // const link = document.createElement('a');
            // link.href = url;
            // link.download = `invoice-INV-001.pdf`;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // URL.revokeObjectURL(url);

            // toast.success('Invoice downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download invoice');
        } finally {
            // setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        if (!html) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Please allow popups to print.');
            return;
        }

        const printContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice INV-001</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        @media print {
                            body { margin: 0; padding: 0; }
                            .no-print { display: none !important; }
                        }
                    </style>
                </head>
                <body>
                    ${html}
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
            await generatePDF();
            // const pdfBlob = await generatePDF();
            // if (navigator.share) {
            //     // setIsGenerating(true);
            //     const pdfBlob = await generatePDF();
            //     const file = new File([pdfBlob], `INV-001-vyapar-drishti.pdf`, { type: 'application/pdf' });

            //     // toast.promise(navigator.share({
            //     //     title: `Invoice INV-001`,
            //     //     text: `Invoice for Customer`,
            //     //     files: [file]
            //     // }), {
            //     //     loading: 'Opening Sharing window...',
            //     //     success: 'Invoice sharing opened successfully!',
            //     //     error: 'Failed to open sharing window.'
            //     // });
            // } else {
            //     // Fallback: Copy link or download
            //     await handleDownload();
            //     toast.error('Invoice downloaded (sharing not supported)');
            // }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Share failed:', error);
                toast.error('Failed to share invoice');
            }
        } finally {
            // setIsGenerating(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mt: 20, display: 'flex', gap: 4, alignItems: 'center' }}>
                <Button onClick={handleDownload}>Download Invoice</Button>
                <Button onClick={handlePrint}>Print Invoice</Button>
                <Button onClick={handleShare}>Share Invoice</Button>
            </Box>
            {file && <FilePreview file={file} onClose={() => setFile(null)} />}
        </Box>
    );
};

export default Xyz;