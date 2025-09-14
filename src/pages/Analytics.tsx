import { Container } from '@mui/material';
import ReportsAndInsights from '@/features/Reports/ReportsAndInsights';


export default function Analytics() {

    return (
        <Container maxWidth={false} sx={{ p: 3, width: "100%" }}>
            <ReportsAndInsights />
        </Container>
    );
};