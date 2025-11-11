import { AlternateEmailOutlined, BarChartOutlined, CheckCircleOutline, CloudUploadOutlined, CurrencyRupeeOutlined, DescriptionOutlined, DownloadOutlined, EditOutlined, InfoOutlined, Inventory2Outlined, PersonOutline, PhoneOutlined, PhotoCameraOutlined, PictureAsPdfOutlined, PrintOutlined, PublicOutlined, ReceiptOutlined, SearchOutlined, ShareOutlined, ShoppingBagOutlined, SummarizeOutlined, TextSnippetOutlined, TrendingUpOutlined, VerifiedOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material";


export default function Icons() {
    const theme = useTheme();
    const iconColor: 'white' | 'black' = theme.palette.mode === 'dark' ? 'white' : 'black';

    return [
        <SummarizeOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <TrendingUpOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <BarChartOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <CheckCircleOutline sx={{ color: iconColor, fontSize: 40, }} />,
        <PrintOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <PhoneOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <ReceiptOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <SearchOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <ShareOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <EditOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <VerifiedOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <AlternateEmailOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <PublicOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <TextSnippetOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <PictureAsPdfOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <InfoOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <PhotoCameraOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <CloudUploadOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <ShoppingBagOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <Inventory2Outlined sx={{ color: iconColor, fontSize: 40, }} />,
        <DescriptionOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <PersonOutline sx={{ color: iconColor, fontSize: 40, }} />,
        <CurrencyRupeeOutlined sx={{ color: iconColor, fontSize: 40, }} />,
        <DownloadOutlined sx={{ color: iconColor, fontSize: 40, }} />,
    ];
}
