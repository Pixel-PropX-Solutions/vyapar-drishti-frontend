import React from 'react';
import { Container, Box } from '@mui/material';
import HeroSection from './HeroSection';
import Footer from './Footer';
import ProblemSection from './ProblemSection';
import SolutionSection from './SolutionSection';
import BenefitsSection from './BenefitsSection';
import CTASection from './CTASection';
import Header from "./Header";
import { Routes, Route } from 'react-router-dom';
import AboutPage from '../About/AboutPage';
import CookiePolicyPage from '../Legal/CookiePolicy';
import PrivacyPolicyPage from '../Legal/PrivacyPolicyPage';
import SecurityPolicyPage from '../Legal/SecurityPolicyPage';
import TermsOfServicePage from '../Legal/TermsOfServicePage';
import PricingPage from '../Pricing/PricingPage';
import ContactPage from '../Contact/ContactPage';

const LandingPage: React.FC = () => {
  return (
    <>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Define the nested routes */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path='/pricing' element={<PricingPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/security" element={<SecurityPolicyPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />

            {/* Default landing page route */}
            <Route path="/" element={
              <>
                <HeroSection />
                <ProblemSection />
                <SolutionSection />
                <BenefitsSection />
                <Container>
                  <CTASection />
                </Container>
              </>
            } />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default LandingPage;
