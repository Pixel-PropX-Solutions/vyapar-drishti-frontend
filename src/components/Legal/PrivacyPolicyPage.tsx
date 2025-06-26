import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Grid,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Security as SecurityIcon,
  LockOutlined as LockIcon,
  VerifiedUser as VerifiedIcon,
  LocalShipping as ShippingIcon,
  Public as PublicIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon
} from '@mui/icons-material';

// Section type for table of contents
interface Section {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

const PrivacyPolicyPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Refs for each section for scrolling
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // List of sections for the table of contents
  const sections: Section[] = [
    { id: 'introduction', title: 'Introduction', icon: <SecurityIcon /> },
    { id: 'information-collected', title: 'Information We Collect', icon: <VerifiedIcon /> },
    { id: 'use-of-information', title: 'How We Use Your Information', icon: <LockIcon /> },
    { id: 'sharing-information', title: 'Sharing Your Information', icon: <ShippingIcon /> },
    { id: 'international-transfers', title: 'International Data Transfers', icon: <PublicIcon /> },
    { id: 'data-retention', title: 'Data Retention and Deletion', icon: <DeleteIcon /> },
    { id: 'user-rights', title: 'Your Rights and Choices', icon: <VerifiedIcon /> },
    { id: 'updates', title: 'Updates to This Policy', icon: <SecurityIcon /> },
    { id: 'contact', title: 'Contact Information', icon: <SecurityIcon /> },
  ];
  
  // Handle scroll to track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Show/hide scroll to top button
      if (scrollPosition > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      // Determine active section
      let currentSection: string | null = null;
      
      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      });
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Last updated date
  const lastUpdated = 'March 15, 2025';
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      
      
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          bgcolor: 'primary.light', 
          color: 'primary.contrastText',
          borderRadius: 2
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1">
          Last Updated: {lastUpdated}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          We value your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.
        </Typography>
      </Paper>
      
      <Grid container spacing={4}>
        {/* Table of Contents - Sticky on desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Box 
              component={Paper} 
              elevation={2} 
              sx={{ 
                p: 2, 
                borderRadius: 1,
                position: 'sticky',
                top: 80
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Table of Contents
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ p: 0 }}>
                {sections.map((section) => (
                  <ListItem 
                    key={section.id}
                    button
                    selected={activeSection === section.id}
                    onClick={() => scrollToSection(section.id)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        }
                      }
                    }}
                  >
                    {section.icon && (
                      <ListItemIcon sx={{ minWidth: 32, color: activeSection === section.id ? 'primary.main' : 'inherit' }}>
                        {section.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText 
                      primary={section.title} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        fontWeight: activeSection === section.id ? 'medium' : 'regular'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        )}
        
        {/* Main content */}
        <Grid item xs={12} md={9}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            {/* Introduction */}
            <Box 
              ref={(el) => (sectionRefs.current['introduction'] = el as HTMLElement | null)} 
              id="introduction"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                1. Introduction
              </Typography>
              <Typography variant="body1" paragraph>
                This privacy policy applies to all users of our SaaS platform. Our platform is designed to help businesses manage and analyze their data effectively while maintaining the highest standards of privacy and security.
              </Typography>
              <Typography variant="body1" paragraph>
                We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our services, and tell you about your privacy rights and how the law protects you.
              </Typography>
              <Typography variant="body1" paragraph>
                Please read this privacy policy carefully. By using our services, you acknowledge that you have read and understood this privacy policy.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Information Collected */}
            <Box 
              ref={(el) => (sectionRefs.current['information-collected'] = el as HTMLElement | null)} 
              id="information-collected"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                2. Information We Collect
              </Typography>
              <Typography variant="body1" paragraph>
                We collect different types of information from and about users of our platform, including:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Personal Identification Information:</strong> Name, email address, phone number, job title, company name, and other similar contact information when you create an account.
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Usage Data:</strong> Information about how you use our platform, including features accessed, time spent, actions taken, and other similar metrics.
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our platform.
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Customer Data:</strong> The data you upload, create, or process through our platform, which may include personal data of your own customers or employees.
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                We collect this information through direct interactions (when you fill out forms or correspond with us), automated technologies or interactions (as you navigate through our platform), and from third parties or publicly available sources.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Use of Information */}
            <Box 
              ref={(el) => (sectionRefs.current['use-of-information'] = el as HTMLElement | null)} 
              id="use-of-information"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                3. How We Use Your Information
              </Typography>
              <Typography variant="body1" paragraph>
                We use the information we collect for various purposes, including:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  {[
                    { title: 'Providing our services', description: 'To deliver the functionality of our platform and meet our contractual obligations' },
                    { title: 'Improving our services', description: 'To understand how users interact with our platform and identify areas for improvement' },
                    { title: 'Customer support', description: 'To respond to your inquiries, troubleshoot problems, and provide technical assistance' },
                    { title: 'Communications', description: 'To send administrative emails, updates, and marketing messages (where permitted)' },
                    { title: 'Security', description: 'To detect, prevent, and address technical issues and security threats' },
                    { title: 'Legal compliance', description: 'To comply with applicable laws, regulations, and legal processes' }
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2">
                          {item.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Typography variant="body1" paragraph>
                We process your personal data only when we have a valid legal basis to do so, such as your consent, the necessity to perform a contract, compliance with a legal obligation, or our legitimate interests (where these don't override your rights and freedoms).
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Sharing Information */}
            <Box 
              ref={(el) => (sectionRefs.current['sharing-information'] = el as HTMLElement | null)} 
              id="sharing-information"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                4. Sharing Your Information
              </Typography>
              <Typography variant="body1" paragraph>
                We may share your information with:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as hosting providers, payment processors, and analytics services.
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Business Partners:</strong> Companies we partner with to offer integrated or co-branded services.
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Legal Authorities:</strong> When required by law, in response to legal processes, or to protect our rights.
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  <strong>Corporate Transactions:</strong> In connection with a merger, acquisition, or sale of assets.
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* International Transfers */}
            <Box 
              ref={(el) => (sectionRefs.current['international-transfers'] = el as HTMLElement | null)} 
              id="international-transfers"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                5. International Data Transfers
              </Typography>
              <Typography variant="body1" paragraph>
                We operate globally and may transfer your personal data to countries other than your country of residence. When we do so, we ensure appropriate safeguards are in place to protect your data and comply with applicable data protection laws.
              </Typography>
              <Typography variant="body1" paragraph>
                These safeguards include:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" paragraph>
                  Standard Contractual Clauses approved by the European Commission
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Binding Corporate Rules for transfers within our corporate group
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Adequacy decisions by the European Commission for certain countries
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Your explicit consent in certain circumstances
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                By using our services, you acknowledge that your personal data may be transferred to our servers and third-party service providers located in different countries around the world.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Data Retention and Deletion */}
            <Box 
              ref={(el) => (sectionRefs.current['data-retention'] = el as HTMLElement | null)} 
              id="data-retention"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                6. Data Retention and Deletion
              </Typography>
              <Typography variant="body1" paragraph>
                We retain your personal data only for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
              </Typography>
              <Typography variant="body1" paragraph>
                The criteria used to determine our retention periods include:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" paragraph>
                  The time needed to provide you with our services
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Legal obligations that require us to keep data for a certain period
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Statutes of limitations, resolution of disputes, and enforcement of agreements
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                When we no longer need to retain your personal data, we will securely delete or anonymize it. For customer data you upload to our platform, you can delete this data at any time through your account settings.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* User Rights */}
            <Box 
              ref={(el) => (sectionRefs.current['user-rights'] = el as HTMLElement | null)} 
              id="user-rights"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                7. Your Rights and Choices
              </Typography>
              <Typography variant="body1" paragraph>
                Depending on your location, you may have various rights regarding your personal data, including:
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { right: 'Access', description: 'Request access to your personal data' },
                  { right: 'Rectification', description: 'Request correction of inaccurate data' },
                  { right: 'Erasure', description: 'Request deletion of your personal data' },
                  { right: 'Restriction', description: 'Request restriction of processing' },
                  { right: 'Portability', description: 'Request transfer of your data' },
                  { right: 'Objection', description: 'Object to processing of your data' }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'primary.light', borderRadius: 1, bgcolor: 'background.paper', height: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom color="primary">
                        {item.right}
                      </Typography>
                      <Typography variant="body2">
                        {item.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="body1" paragraph>
                To exercise these rights, please contact us using the information provided in the "Contact Information" section. We will respond to your request within the timeframe required by applicable law.
              </Typography>
              <Typography variant="body1" paragraph>
                Please note that certain rights may be limited in some circumstances, such as when we have a legal obligation to retain data or when the rights of others would be violated.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Updates */}
            <Box 
              ref={(el) => (sectionRefs.current['updates'] = el as HTMLElement | null)} 
              id="updates"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                8. Updates to This Policy
              </Typography>
              <Typography variant="body1" paragraph>
                We may update this privacy policy from time to time to reflect changes in our practices, technology, legal requirements, and other factors. When we make material changes to this policy, we will notify you by:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" paragraph>
                  Posting a notice on our website
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Sending an email to the address associated with your account
                </Typography>
                <Typography component="li" variant="body1" paragraph>
                  Displaying a notification within our platform
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                We encourage you to review this policy periodically to stay informed about our privacy practices. The "Last Updated" date at the top of this policy indicates when it was last revised.
              </Typography>
              <Typography variant="body1" paragraph>
                Your continued use of our services after any changes to this privacy policy constitutes your acceptance of the revised policy.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            {/* Contact */}
            <Box 
              ref={(el) => (sectionRefs.current['contact'] = el as HTMLElement | null)} 
              id="contact"
              sx={{ scrollMarginTop: '80px' }}
            >
              <Typography variant="h4" component="h2" gutterBottom color="primary" fontWeight="medium">
                9. Contact Information
              </Typography>
              <Typography variant="body1" paragraph>
                If you have any questions, concerns, or requests regarding this privacy policy or our privacy practices, please contact us at:
              </Typography>
              
              <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 1, mb: 3, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Our Data Protection Officer
                </Typography>
                <Typography variant="body1">Email: privacy@vyapardrishti.in</Typography>
                <Typography variant="body1">Phone: +91 63670 97548</Typography>
                <Typography variant="body1">Address: 123 Tech Park, Bangalore 560001, India</Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                We are committed to addressing your concerns and resolving any complaints about our collection or use of your personal data.
              </Typography>
              <Typography variant="body1" paragraph>
                If you are not satisfied with our response, you may have the right to lodge a complaint with a data protection authority or other regulatory agency.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Back to top button */}
      <Fade in={showScrollTop}>
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 100,
            bgcolor: 'primary.main',
            color: 'white',
            width: 50,
            height: 50,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 3,
            transition: 'all 0.3s',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-3px)'
            }
          }}
        >
          <ArrowUpwardIcon />
        </Box>
      </Fade>
    </Container>
  );
};

export default PrivacyPolicyPage;