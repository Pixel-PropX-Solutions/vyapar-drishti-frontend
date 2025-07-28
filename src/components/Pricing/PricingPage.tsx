import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button, 
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
  Paper,
  useTheme,
  Zoom
} from '@mui/material';
import { 
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Timer as TimerIcon,
  Bolt as BoltIcon,
  Support as SupportIcon
} from '@mui/icons-material';

// Interface for plan features
interface PlanFeature {
  name: string;
  starter: boolean;
  professional: boolean;
  enterprise: boolean;
  tooltip?: string;
}

// Interface for pricing plans
interface PricingPlan {
  title: string;
  subtitle: string;
  priceMonthlyINR: number;
  priceYearlyINR: number;
  priceMonthlyUSD: number;
  priceYearlyUSD: number;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  color: string;
  icon: React.ReactNode;
}

const PricingPage: React.FC = () => {
  const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  
  // Pricing plans data
  const pricingPlans: PricingPlan[] = [
    {
      title: 'Starter',
      subtitle: 'Perfect for small businesses and startups',
      priceMonthlyINR: 999,
      priceYearlyINR: 9990,
      priceMonthlyUSD: 12,
      priceYearlyUSD: 120,
      features: [
        'Up to 5 users',
        '10GB data storage',
        'Basic analytics',
        'Email support'
      ],
      buttonText: 'Start Free Trial',
      color: '#3f51b5',
      icon: <TimerIcon fontSize="large" />
    },
    {
      title: 'Professional',
      subtitle: 'Ideal for growing businesses',
      priceMonthlyINR: 2499,
      priceYearlyINR: 24990,
      priceMonthlyUSD: 30,
      priceYearlyUSD: 300,
      features: [
        'Up to 20 users',
        '50GB data storage',
        'Advanced analytics',
        'Priority email support',
        'API access',
        'Custom dashboards'
      ],
      buttonText: 'Start Free Trial',
      highlighted: true,
      color: '#7e57c2',
      icon: <BoltIcon fontSize="large" />
    },
    {
      title: 'Enterprise',
      subtitle: 'For large organizations with complex needs',
      priceMonthlyINR: 7999,
      priceYearlyINR: 79990,
      priceMonthlyUSD: 97,
      priceYearlyUSD: 970,
      features: [
        'Unlimited users',
        '250GB data storage',
        'Enterprise analytics',
        '24/7 phone & email support',
        'Advanced API access',
        'Custom integrations',
        'Dedicated account manager',
        'SSO & advanced security'
      ],
      buttonText: 'Contact Sales',
      color: '#5e35b1',
      icon: <SupportIcon fontSize="large" />
    }
  ];
  
  // Plan feature comparison
  const planFeatures: PlanFeature[] = [
    { name: 'Team members', starter: true, professional: true, enterprise: true, tooltip: 'Number of user accounts' },
    { name: 'Data storage', starter: true, professional: true, enterprise: true, tooltip: 'Cloud storage for your data' },
    { name: 'Basic analytics', starter: true, professional: true, enterprise: true },
    { name: 'Advanced analytics', starter: false, professional: true, enterprise: true, tooltip: 'Includes trend analysis, forecasting, and custom reports' },
    { name: 'Enterprise analytics', starter: false, professional: false, enterprise: true, tooltip: 'AI-powered insights and recommendations' },
    { name: 'Email support', starter: true, professional: true, enterprise: true },
    { name: 'Priority support', starter: false, professional: true, enterprise: true },
    { name: '24/7 phone support', starter: false, professional: false, enterprise: true },
    { name: 'API access', starter: false, professional: true, enterprise: true, tooltip: 'Access our platform programmatically' },
    { name: 'Custom dashboards', starter: false, professional: true, enterprise: true },
    { name: 'Custom integrations', starter: false, professional: false, enterprise: true, tooltip: 'Connect with your existing tools and software' },
    { name: 'Dedicated account manager', starter: false, professional: false, enterprise: true },
    { name: 'SSO & advanced security', starter: false, professional: false, enterprise: true, tooltip: 'Single Sign-On, SAML, and enhanced security features' },
  ];

  // Format price with appropriate currency symbol
  const formatPrice = (price: number, currency: 'INR' | 'USD') => {
    if (currency === 'INR') {
      return `&#8377;${price.toLocaleString('en-IN')}`;
    } else {
      return `$${price.toLocaleString('en-US')}`;
    }
  };

  // Calculate yearly savings percentage
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const yearlyCost = yearlyPrice;
    const savings = monthlyCost - yearlyCost;
    const savingsPercentage = Math.round((savings / monthlyCost) * 100);
    return savingsPercentage;
  };

  // Handle currency toggle
  const toggleCurrency = () => {
    setCurrency(currency === 'INR' ? 'USD' : 'INR');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Pricing Header */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary">
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Choose the perfect plan for your business needs. All plans include a 14-day free trial.
        </Typography>
        
        {/* Billing Toggle */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
            mb: 2
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={isYearly}
                onChange={() => setIsYearly(!isYearly)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1">
                  {isYearly ? 'Yearly billing' : 'Monthly billing'}
                </Typography>
                {isYearly && (
                  <Chip 
                    size="small" 
                    label="Save 20%" 
                    color="success" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
          />
          
          <Divider orientation="vertical" flexItem />
          
          <FormControlLabel
            control={
              <Switch
                checked={currency === 'USD'}
                onChange={toggleCurrency}
                color="primary"
              />
            }
            label={
              <Typography variant="body1">
                {currency === 'INR' ? 'INR (&#8377;)' : 'USD ($)'}
              </Typography>
            }
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {currency === 'INR' ? '&#8377;1 = $0.012 USD' : '$1 = &#8377;82.5 INR'}
        </Typography>
      </Box>
      
      {/* Pricing Cards */}
      <Grid container spacing={4} justifyContent="center">
        {pricingPlans.map((plan, index) => {
          // Get the correct price based on billing cycle and currency
          const price = isYearly
            ? (currency === 'INR' ? plan.priceYearlyINR : plan.priceYearlyUSD)
            : (currency === 'INR' ? plan.priceMonthlyINR : plan.priceMonthlyUSD);
            
          // Calculate savings
          const savingsPercentage = calculateSavings(
            currency === 'INR' ? plan.priceMonthlyINR : plan.priceMonthlyUSD,
            currency === 'INR' ? plan.priceYearlyINR : plan.priceYearlyUSD
          );
          
          return (
            <Grid item xs={12} md={4} key={index}>
              <Zoom appear in style={{ transitionDelay: `${index * 100}ms` }}>
                <Card 
                  raised={plan.highlighted || hoveredPlan === index}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    transform: (plan.highlighted || hoveredPlan === index) ? 'scale(1.05)' : 'scale(1)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: plan.highlighted ? `2px solid ${plan.color}` : 'none',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 8
                    }
                  }}
                  onMouseEnter={() => setHoveredPlan(index)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {plan.highlighted && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 15, 
                        right: -35, 
                        transform: 'rotate(45deg)',
                        backgroundColor: plan.color, 
                        color: 'white',
                        px: 4,
                        py: 0.5,
                        width: 150,
                        textAlign: 'center',
                        zIndex: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Popular
                      </Typography>
                    </Box>
                  )}
                  
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: plan.color }}>
                          {plan.icon}
                        </Box>
                        <Typography variant="h5" fontWeight="bold">
                          {plan.title}
                        </Typography>
                      </Box>
                    }
                    subheader={plan.subtitle}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    sx={{ 
                      backgroundColor: `${plan.color}15`, 
                      pb: 3,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h3" component="h2" color={plan.color} fontWeight="bold">
                        {formatPrice(price, currency)}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        per {isYearly ? 'year' : 'month'}
                      </Typography>
                      {isYearly && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                          Save {savingsPercentage}% with yearly billing
                        </Typography>
                      )}
                    </Box>
                    
                    <List sx={{ mb: 3, flexGrow: 1 }}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} dense>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon sx={{ color: plan.color }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button 
                      variant={plan.highlighted ? "contained" : "outlined"} 
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{ 
                        py: 1.5, 
                        borderRadius: 1,
                        background: plan.highlighted 
                          ? `linear-gradient(45deg, ${plan.color} 30%, ${plan.color}99 90%)` 
                          : 'transparent',
                        '&:hover': {
                          background: plan.highlighted 
                            ? `linear-gradient(45deg, ${plan.color} 30%, ${plan.color}99 90%)` 
                            : `${plan.color}15`
                        }
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Feature Comparison */}
      <Paper
        elevation={3}
        sx={{
          mt: 10,
          p: 4,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom align="center" fontWeight="bold" sx={{ mb: 4 }}>
          Feature Comparison
        </Typography>
        
        <Grid container sx={{ mb: 2, pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold">Feature</Typography>
          </Grid>
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={4} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color={pricingPlans[0].color}>
                  Starter
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color={pricingPlans[1].color}>
                  Professional
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color={pricingPlans[2].color}>
                  Enterprise
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        {planFeatures.map((feature, index) => (
          <Grid 
            container 
            key={index} 
            sx={{ 
              py: 1.5, 
              borderBottom: index < planFeatures.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)'
              }
            }}
          >
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">
                {feature.name}
                {feature.tooltip && (
                  <Tooltip title={feature.tooltip} arrow>
                    <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary', verticalAlign: 'middle' }} />
                  </Tooltip>
                )}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  {feature.starter ? (
                    <CheckIcon sx={{ color: 'success.main' }} />
                  ) : (
                    <CloseIcon sx={{ color: 'text.disabled' }} />
                  )}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  {feature.professional ? (
                    <CheckIcon sx={{ color: 'success.main' }} />
                  ) : (
                    <CloseIcon sx={{ color: 'text.disabled' }} />
                  )}
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  {feature.enterprise ? (
                    <CheckIcon sx={{ color: 'success.main' }} />
                  ) : (
                    <CloseIcon sx={{ color: 'text.disabled' }} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Paper>
      
      {/* FAQs or Additional Information */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Have Questions?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Our team is here to help you choose the right plan for your business.
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
};

export default PricingPage;