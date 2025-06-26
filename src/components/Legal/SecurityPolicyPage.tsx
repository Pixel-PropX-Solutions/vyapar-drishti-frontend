import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HttpsIcon from '@mui/icons-material/Https';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import DataUsageIcon from '@mui/icons-material/DataUsage';

interface SecuritySection {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

interface SecurityFAQ {
  question: string;
  answer: string;
}

const SecurityPolicyPage: React.FC = () => {
  const securitySections: SecuritySection[] = [
    {
      title: "Data Encryption",
      icon: <LockIcon color="primary" />,
      content: [
        "All data transmitted between your device and our servers is encrypted using TLS 1.3 protocol with strong ciphers.",
        "Data at rest is encrypted using AES-256 industry standard encryption.",
        "We implement perfect forward secrecy to ensure that encrypted sessions cannot be decrypted even if the server key is compromised."
      ]
    },
    {
      title: "Authentication & Access",
      icon: <VpnLockIcon color="primary" />,
      content: [
        "We support multi-factor authentication (MFA) for all user accounts and strongly encourage its use.",
        "Access to our systems is strictly controlled through role-based access control (RBAC).",
        "Failed login attempts are monitored, with automatic account locking after multiple failures to prevent brute force attacks.",
        "All authentication tokens are securely hashed and have configurable expiration times."
      ]
    },
    {
      title: "Infrastructure Security",
      icon: <ShieldIcon color="primary" />,
      content: [
        "Our infrastructure is hosted in SOC 2 Type II and ISO 27001 certified data centers.",
        "We employ network segmentation, firewalls, and intrusion detection/prevention systems.",
        "Regular vulnerability scans and penetration tests are conducted by independent third parties.",
        "Security patches are applied promptly following a rigorous testing and deployment procedure."
      ]
    },
    {
      title: "Monitoring & Incident Response",
      icon: <DataUsageIcon color="primary" />,
      content: [
        "24/7 security monitoring of all systems and networks.",
        "Automated alerting for suspicious activities and potential security incidents.",
        "Comprehensive incident response plan with defined roles and procedures.",
        "Regular security drills and tabletop exercises to ensure our team is prepared to respond effectively."
      ]
    }
  ];

  const securityFAQs: SecurityFAQ[] = [
    {
      question: "How do you protect my personal information?",
      answer: "Your personal information is protected through a combination of encryption, access controls, and secure development practices. We only collect the minimum information necessary, store it securely with encryption, and strictly limit access to authorized personnel."
    },
    {
      question: "Do you share my data with third parties?",
      answer: "We only share your data with third parties when necessary to provide our services, and only with providers who maintain similarly strict security standards. All third-party providers are carefully vetted and bound by data processing agreements."
    },
    {
      question: "What should I do if I discover a security vulnerability?",
      answer: "If you believe you've found a security vulnerability, please contact our security team immediately at security@vyapardrishti.in. We have a responsible disclosure policy and appreciate the security community's efforts to help us maintain a secure platform."
    },
    {
      question: "How can I make my account more secure?",
      answer: "We recommend enabling multi-factor authentication, using a unique and strong password, regularly reviewing your account activity, and keeping your devices and software up to date."
    }
  ];

  const certifications = [
    { name: "ISO 27001", description: "Information security management" },
    { name: "SOC 2 Type II", description: "Service organization controls" },
    { name: "GDPR Compliant", description: "European data protection standards" },
    { name: "HIPAA Compliant", description: "Healthcare information protection" }
  ];

  const lastUpdated = "February 28, 2025";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Security Policy
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last updated: {lastUpdated}
        </Typography>
        
        <Typography variant="body1" paragraph>
          At Vyapar Drishti, security is our top priority. We employ industry-leading practices to ensure your data remains safe, 
          private, and accessible only to authorized parties. This document outlines our security measures and commitment to protecting your information.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {securitySections.map((section, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {section.icon}
                    <Typography variant="h6" fontWeight="medium" ml={1}>
                      {section.title}
                    </Typography>
                  </Box>
                  <List dense>
                    {section.content.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemIcon sx={{ minWidth: '28px' }}>
                          <HttpsIcon fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Certifications & Compliance
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          {certifications.map((cert, index) => (
            <Chip
              key={index}
              icon={<VerifiedUserIcon />}
              label={cert.name}
              variant="outlined"
              color="primary"
              sx={{ m: 0.5, p: 1 }}
              title={cert.description}
            />
          ))}
        </Box>

        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Security FAQ
        </Typography>
        
        {securityFAQs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Report a Security Issue
          </Typography>
          <Typography variant="body1">
            If you discover a potential security issue, please contact us immediately at <Link href="mailto:security@example.com">security@example.com</Link>.
            We take all security concerns seriously and will respond promptly.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SecurityPolicyPage;