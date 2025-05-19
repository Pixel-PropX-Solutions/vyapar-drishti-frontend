import { Container, Grid, Typography, Button, Box, Paper, Card, CardContent, Stack } from '@mui/material';
import { ArrowForward } from '@mui/icons-material'; // Adding an icon for more visual appeal
import theme from '@/theme';
import react from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  return (
    <Stack>
      {/* Header Section */}
      <Box
        sx={{
          // backgroundImage: 'url(https://www.example.com/hero-image.jpg)', // Add a background image to the header
          background: "linear-gradient(to top,rgb(0, 234, 251),rgb(0, 200, 255),rgb(89, 0, 255))",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          padding: '120px 0',
          textAlign: 'center',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Container >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Smart Document & Billing Management System
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'light', mb: 3 }}>
            Empower your business with intelligent document handling and detailed billing analysis.
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: '30px',
              // backgroundColor: '#3f51b5',
              color: '#fff',
              fontWeight: 'bold',

              padding: '12px 30px',
            }}
            onClick={() => { navigate('/login') }}
          // href="#overview"
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Overview Section */}
      <Stack sx={{ padding: '60px 0' }}>
        <Typography variant="h4" sx={{ marginBottom: '30px', fontWeight: 'bold', color: '#3f51b5', textAlign: 'center' }}>
          Overview
        </Typography>
        <Typography variant="body1" paragraph align="center" sx={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          This is a web-based application that enables users to interact with various types of documents in an intelligent and user-friendly manner. It offers search functionality through both voice and text prompts and provides advanced features for managing and analyzing bills.
        </Typography>
      </Stack>

      {/* Landing Page Section */}
      <Box
        sx={{
          backgroundColor: '#f4f4f9',
          padding: '80px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 2 }}>
                Simplify Your Document and Billing Process
              </Typography>
              <Typography variant="body1" paragraph>
                Easily upload and manage your documents, generate reports, and gain insights with minimal effort. Our platform helps automate the tedious processes, allowing you to focus on what matters most—growing your business.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '12px 30px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                href="#features"
              >
                Learn More
                <ArrowForward sx={{ ml: 1 }} />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                src={react} // Add a relevant image for the landing section
                alt="Landing"
                style={{ height: "150px", margin: "auto", borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* Key Features Section */}
      <Stack id="features" sx={{ padding: '80px 0' }}>
        <Typography variant="h4" sx={{ marginBottom: '30px', fontWeight: 'bold', color: `${theme.palette.primary.main}`, textAlign: 'center' }}>
          Key Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Document Interaction Feature */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', boxShadow: 3, padding: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Document Interaction
                </Typography>
                <Typography variant="body1" paragraph>
                  - Upload any type of document (PDFs, Word, etc.).<br />
                  - Ask document-specific questions and get precise answers.<br />
                  - Utilize both voice-based and text-based search options for better accessibility.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Billing Analysis Feature */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', boxShadow: 3, padding: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Billing Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                  - Extract product and transaction data from uploaded bills.<br />
                  - Automatically generate detailed reports on sales and purchases.<br />
                  - Provide monthly summaries for better financial insights.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Search Functionality Feature */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', boxShadow: 3, padding: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Search Functionality
                </Typography>
                <Typography variant="body1" paragraph>
                  - Integrated voice search for hands-free operation.<br />
                  - Text-based prompts for specific queries or deep searches.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>

      {/* Potential Upgrades Section */}
      <Stack sx={{ padding: '80px 0' }}>
        <Typography variant="h4" sx={{ marginBottom: '30px', fontWeight: 'bold', color: `${theme.palette.primary.main}`, textAlign: 'center' }}>
          Potential Upgrades
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ textAlign: 'center', padding: '20px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                AI-Powered Insights
              </Typography>
              <Typography variant="body1" paragraph>
                - Predictive analytics for purchase forecasting.<br />
                - Sales forecasting for better decision making.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ textAlign: 'center', padding: '20px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Mobile App Integration
              </Typography>
              <Typography variant="body1" paragraph>
                - Build a mobile app version for on-the-go document interactions and billing reports.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ textAlign: 'center', padding: '20px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Advanced Visualizations
              </Typography>
              <Typography variant="body1" paragraph>
                - Dashboards with advanced graphs, pie charts, and heatmaps for better analytics.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Stack>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: `${theme.palette.primary.main}`,
          color: '#fff',
          padding: '40px 0',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '14px' }}>
          © 2025 Smart Document & Billing Management. All Rights Reserved.
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Button sx={{ color: '#fff', textTransform: 'none', margin: '0 10px' }}>Privacy</Button>
          <Button sx={{ color: '#fff', textTransform: 'none', margin: '0 10px' }}>Terms</Button>
          <Button sx={{ color: '#fff', textTransform: 'none', margin: '0 10px' }}>Support</Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default Home;
