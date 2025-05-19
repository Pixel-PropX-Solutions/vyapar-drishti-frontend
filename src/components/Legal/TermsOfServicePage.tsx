import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Divider, 
  Paper, 

  Button
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';

interface TermsSection {
  title: string;
  content: string[];
}

const TermsOfServicePage: React.FC = () => {
  const termsData: TermsSection[] = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
        "If you do not agree with any of these terms, you are prohibited from using or accessing this site."
      ]
    },
    {
      title: "2. Use License",
      content: [
        "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials",
        "• Use the materials for any commercial purpose",
        "• Attempt to decompile or reverse engineer any software contained on our website",
        "• Remove any copyright or other proprietary notations from the materials",
        "• Transfer the materials to another person or 'mirror' the materials on any other server"
      ]
    },
    {
      title: "3. Disclaimer",
      content: [
        "The materials on our website are provided on an 'as is' basis.",
        "We make no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        "Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our website or otherwise relating to such materials or on any sites linked to this site."
      ]
    },
    {
      title: "4. Limitations",
      content: [
        "In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage."
      ]
    },
    {
      title: "5. Revisions and Errata",
      content: [
        "The materials appearing on our website could include technical, typographical, or photographic errors.",
        "We do not warrant that any of the materials on our website are accurate, complete, or current.",
        "We may make changes to the materials contained on our website at any time without notice."
      ]
    },
    {
      title: "6. Links",
      content: [
        "We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site.",
        "The inclusion of any link does not imply endorsement by us of the site.",
        "Use of any such linked website is at the user's own risk."
      ]
    },
    {
      title: "7. Modifications to Terms of Service",
      content: [
        "We may revise these terms of service for our website at any time without notice.",
        "By using this website, you are agreeing to be bound by the then-current version of these terms of service."
      ]
    },
    {
      title: "8. Governing Law",
      content: [
        "These terms and conditions are governed by and construed in accordance with the laws of our jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
      ]
    }
  ];

  const lastUpdated = "March 15, 2025";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      <Box display="flex" alignItems="center" mb={4}>
        <GavelIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Terms of Service
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last updated: {lastUpdated}
        </Typography>
        <Typography variant="body1" paragraph>
          Please read these Terms of Service carefully before using our website and services. 
          Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {termsData.map((section, index) => (
          <Box key={index} mb={4}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              {section.title}
            </Typography>
            {section.content.map((paragraph, pIndex) => (
              <Typography key={pIndex} variant="body1" paragraph>
                {paragraph}
              </Typography>
            ))}
          </Box>
        ))}
      </Paper>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="outlined" href="/privacy">
          Privacy Policy
        </Button>
        <Button variant="contained" color="primary">
          Accept Terms
        </Button>
      </Box>
    </Container>
  );
};

export default TermsOfServicePage;