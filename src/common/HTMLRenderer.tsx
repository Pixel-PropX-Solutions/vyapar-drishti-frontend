
interface Props {
    htmlString: string;
}

const HTMLRenderer: React.FC<Props> = ({ htmlString }) => {
    return (
        // <Box
        //         component="div"
        //         dangerouslySetInnerHTML={{ __html: htmlString }}
        //         sx={{
        //             "& a": {
        //                 color: "primary.main",
        //                 textDecoration: "underline",
        //             },
        //             "& img": {
        //                 maxWidth: "100%",
        //                 height: "auto",
        //             },
        //             "& p": {
        //                 marginBottom: 2,
        //             },
        //             ".page": {
        //                 width: '210mm',
        //                 height: '307mm',
        //                 padding: '17mm 0',
        //                 margin: 'auto',
        //                 marginBottom: '10mm',
        //                 backgroundColor: "#fff",
        //                 boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        //                 position: 'relative',
        //                 overflow: 'hidden',
        //                 pageBreakAfter: 'always', 
        //             },
        //             ".header": {
        //                 position: 'absolute',
        //                 top: 0,
        //                 left: 0,
        //                 right: 0,
        //                 height: '40mm',
        //                 textAlign: 'center',
        //             },
        //             ".footer": {
        //                 position: 'absolute',
        //                 bottom: 0,
        //                 left: 0,
        //                 right: 0,
        //                 // height: '30mm',
        //                 textAlign: 'center',
        //             },
        //             ".content": {
        //                 marginTop: '80mm',
        //                 marginBottom: '40mm',
        //             },
        //             ".item-row": {
        //                 marginBottom: '6px',
        //                 pageBreakInside: 'avoid',
        //             },
        //             ".total-section": {
        //                 pageBreakInside: 'avoid',
        //                 breakInside: 'avoid',
        //                 marginTop: '20px',
        //                 textAlign: 'right',
        //             },
        //         }}
        //     />
        <iframe
            srcDoc={htmlString}
            title="HTML Viewer"
            style={{ width: "100%", height: "100vh", border: "none" }}
        />
    );
};

export default HTMLRenderer;