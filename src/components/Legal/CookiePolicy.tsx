import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Collapse,
  IconButton,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  defaultEnabled: boolean;
}

interface CookieDetail {
  name: string;
  purpose: string;
  provider: string;
  expiry: string;
  category: string;
}

const CookiePolicyPage: React.FC = () => {
  const cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: 'Necessary',
      description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.',
      required: true,
      defaultEnabled: true
    },
    {
      id: 'preferences',
      name: 'Preferences',
      description: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region you are in.',
      required: false,
      defaultEnabled: true
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Analytics cookies help website owners understand how visitors interact with websites by collecting and reporting information anonymously.',
      required: false,
      defaultEnabled: false
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
      required: false,
      defaultEnabled: false
    }
  ];

  const cookieDetails: CookieDetail[] = [
    { name: 'session_id', purpose: 'Maintains user session', provider: 'Our Website', expiry: 'Session', category: 'necessary' },
    { name: 'csrf_token', purpose: 'Prevents cross-site request forgery', provider: 'Our Website', expiry: 'Session', category: 'necessary' },
    { name: 'auth_token', purpose: 'Authentication', provider: 'Our Website', expiry: '30 days', category: 'necessary' },
    { name: 'language', purpose: 'Stores language preference', provider: 'Our Website', expiry: '1 year', category: 'preferences' },
    { name: 'theme', purpose: 'Stores theme preference', provider: 'Our Website', expiry: '1 year', category: 'preferences' },
    { name: '_ga', purpose: 'Distinguishes users', provider: 'Google Analytics', expiry: '2 years', category: 'analytics' },
    { name: '_gid', purpose: 'Distinguishes users', provider: 'Google Analytics', expiry: '24 hours', category: 'analytics' },
    { name: '_fbp', purpose: 'Stores and tracks visits across websites', provider: 'Facebook', expiry: '3 months', category: 'marketing' },
    { name: 'ads_id', purpose: 'Used for advertising', provider: 'Google Ads', expiry: '3 months', category: 'marketing' }
  ];

  const [cookieConsent, setCookieConsent] = useState<Record<string, boolean>>(
    cookieCategories.reduce((acc, category) => {
      acc[category.id] = category.defaultEnabled;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [expandedTable, setExpandedTable] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const lastUpdated = "March 1, 2025";

  const handleConsentChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (id === 'necessary') return; // Cannot change necessary cookies
    setCookieConsent({ ...cookieConsent, [id]: event.target.checked });
  };

  const handleSavePreferences = () => {
    // In a real implementation, this would save the cookie preferences
    // console.log('Saving cookie preferences:', cookieConsent);
    setSnackbarOpen(true);
  };

  const handleAcceptAll = () => {
    const allEnabled = cookieCategories.reduce((acc, category) => {
      acc[category.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setCookieConsent(allEnabled);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <CookieIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Cookie Policy
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last updated: {lastUpdated}
        </Typography>

        <Typography variant="body1" paragraph>
          This Cookie Policy explains how Vyapar Drishti uses cookies and similar technologies 
          to recognize you when you visit our website. It explains what these technologies are 
          and why we use them, as well as your rights to control our use of them.
        </Typography>

        <Typography variant="body1" paragraph>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
          as well as to provide reporting information.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Cookie Preferences
        </Typography>

        <FormGroup sx={{ mb: 4 }}>
          {cookieCategories.map((category) => (
            <Box key={category.id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={cookieConsent[category.id]}
                    onChange={handleConsentChange(category.id)}
                    disabled={category.required}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" component="span">
                      {category.name}
                      {category.required && (
                        <Typography component="span" color="text.secondary" variant="caption" sx={{ ml: 1 }}>
                          (Required)
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', m: 0 }}
              />
            </Box>
          ))}
        </FormGroup>

        <Box display="flex" justifyContent="space-between" mb={4}>
          <Button variant="outlined" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
          <Button variant="contained" color="primary" onClick={handleAcceptAll}>
            Accept All
          </Button>
        </Box>

        <Box mb={3}>
          <Box 
            display="flex" 
            alignItems="center" 
            onClick={() => setExpandedTable(!expandedTable)} 
            sx={{ cursor: 'pointer', mb: 2 }}
          >
            <Typography variant="h6" component="h3">
              Detailed Cookie Information
            </Typography>
            <IconButton size="small">
              {expandedTable ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedTable}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Expiry</TableCell>
                    <TableCell>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cookieDetails.map((cookie, index) => (
                    <TableRow key={index}>
                      <TableCell>{cookie.name}</TableCell>
                      <TableCell>{cookie.purpose}</TableCell>
                      <TableCell>{cookie.provider}</TableCell>
                      <TableCell>{cookie.expiry}</TableCell>
                      <TableCell>
                        <Chip
                          label={cookie.category.charAt(0).toUpperCase() + cookie.category.slice(1)} 
                          size="small" 
                          color={cookie.category === 'necessary' ? 'primary' : 'default'} 
                          variant={cookie.category === 'necessary' ? 'filled' : 'outlined'} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom>
          How to Control Cookies
        </Typography>
        
        <Typography variant="body1" paragraph>
          In addition to the controls provided above, you can choose to block or delete cookies through your browser settings. 
          However, if you choose to delete or block certain cookies, you might not be able to use some features of our services. 
        </Typography>

        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
            <InfoIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
            Browser Settings
          </Typography>
          <Typography variant="body2">
            To learn how to manage cookies in your browser, please visit:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 0 }}>
            <Typography component="li" variant="body2">Chrome: <Link href="https://support.google.com/chrome/answer/95647" target="_blank">Managing cookies in Chrome</Link></Typography>
            <Typography component="li" variant="body2">Firefox: <Link href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank">Cookies in Firefox</Link></Typography>
            <Typography component="li" variant="body2">Safari: <Link href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank">Managing cookies in Safari</Link></Typography>
            <Typography component="li" variant="body2">Edge: <Link href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank">View and delete cookies in Microsoft Edge</Link></Typography>
          </Box>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom>
          Changes to Our Cookie Policy
        </Typography>
        
        <Typography variant="body1">
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. 
          Please visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </Typography>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your cookie preferences have been saved!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CookiePolicyPage;