import React from 'react';
import { Container, Box } from '@mui/material';
import HeroSection from './HeroSection';
import Footer from './Footer';
import ProblemSection from './ProblemSection';
import SolutionSection from './SolutionSection';
import BenefitsSection from './BenefitsSection';
import CTASection from './CTASection';
import Header from "./Header";

const LandingPage: React.FC = () => {
  return (
    <>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <BenefitsSection />
            <Container>
              <CTASection />
            </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default LandingPage;
