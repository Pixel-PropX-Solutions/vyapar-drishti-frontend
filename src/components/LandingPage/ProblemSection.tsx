import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
//   useMediaQuery,
  Grow,
  Fade,
} from '@mui/material';
import {
  CloudUpload,
  Inventory,
  Insights,
  Notifications,
  Info,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import ProblemSolutionTimeline from './ProblemSolutionTimeline';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardHover = {
  rest: { 
    scale: 1,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  hover: { 
    scale: 1.03, 
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const iconAnimation = {
  rest: { y: 0 },
  hover: { y: -5, transition: { duration: 0.3, yoyo: Infinity, ease: "easeInOut" } }
};

// const descriptionAnimation = {
//   hidden: { opacity: 0, height: 0 },
//   visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
// };

const ProblemSection: React.FC = () => {
  const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedCard, _] = useState<number | null>(null);
  const [selectedStat, setSelectedStat] = useState<number>(0);
  
  // Statistics data
  const stats = [
    { value: "68%", label: "of pharmacies struggle with inventory errors" },
    { value: "12.5", label: "hours wasted weekly on manual data entry" },
    { value: "42%", label: "experience stockouts due to poor tracking" },
    { value: "30%", label: "higher costs from inefficient returns" }
  ];

  // Problem card data
  const problemCards = [
    {
      title: "Manual Data Entry",
      description:"Time-consuming and error-prone manual input of stock data leading to inaccurate inventory records",
      shortDescription: "Time-consuming and error-prone manual input of stock data",
      fullDescription: "Pharmacy staff spend hours manually entering inventory data from paper invoices and receipts. This tedious process is highly susceptible to human error, leading to discrepancies between actual stock levels and recorded information. These inaccuracies cascade through your business operations, affecting ordering, sales, and financial reporting.",
      icon: <CloudUpload fontSize="large" />,
      color: theme.palette.primary.main,
      stat: "23% error rate in manual inventory records",
      solution: "Automated document scanning and data extraction"
    },
    {
      title: "Disorganized Data",
      description:"Poor organization of stock and sales information makes it difficult to track trends and make informed decisions",
      shortDescription: "Poorly structured information makes tracking trends impossible",
      fullDescription: "Without a unified system, your valuable business data remains scattered across spreadsheets, notebooks, and disconnected software. This fragmentation prevents you from identifying sales patterns, inventory trends, or opportunities for optimization. It's like having puzzle pieces from different sets – impossible to form a complete picture of your pharmacy's performance.",
      icon: <Inventory fontSize="large" />,
      color: '#1976D2', // Secondary blue
      stat: "85% of pharmacies can't access historical data easily",
      solution: "Centralized data management system"
    },
    {
      title: "Lack of Business Insights",
      description:"Missing valuable insights on sales performance, inventory optimization, and business growth opportunities",
      shortDescription: "Missing critical information for strategic decision-making",
      fullDescription: "Without automated analytics, pharmacies make business decisions based on intuition rather than data. You might be missing opportunities to optimize your inventory, unaware of which products drive your profits, or blind to seasonal trends that could inform your purchasing strategy. In today's competitive market, operating without data-driven insights places your pharmacy at a significant disadvantage.",
      icon: <Insights fontSize="large" />,
      color: '#7B1FA2', // Purple
      stat: "42% revenue increase with data-driven decisions",
      solution: "Advanced analytics and reporting dashboard"
    },
    {
      title: "Inefficient Returns",
      description:"Delayed or forgotten returns to stockists leading to excess inventory costs and strained supplier relationships",
      shortDescription: "Lost revenue from forgotten or mismanaged returns",
      fullDescription: "Expired medications and unsold inventory represent significant financial losses when return processes are managed manually. Without systematic tracking, return deadlines are missed, supplier policies aren't optimized, and your pharmacy absorbs unnecessary costs. Additionally, the administrative burden of processing returns manually diverts staff time away from customer service and other value-adding activities.",
      icon: <Notifications fontSize="large" />,
      color: '#C2185B', // Pink
      stat: "$4,200 average monthly losses from missed returns",
      solution: "Automated returns management system"
    }
  ];

//   const handleCardClick = (index: number) => {
//     if (expandedCard === index) {
//       setExpandedCard(null);
//     } else {
//       setExpandedCard(index);
//     }
//   };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      sx={{ 
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'radial-gradient(circle at 10% 20%, rgba(46, 125, 50, 0.03) 0%, rgba(255, 255, 255, 0) 80%)',
          zIndex: -1
        }
      }}
    >
      <Container maxWidth="lg">
        {/* Section header with animated underline */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 6, md: 8 },
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              bgcolor: 'primary.main',
              borderRadius: '2px'
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: 2,
                display: 'inline-block',
                background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              THE CHALLENGE
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                backgroundImage: 'linear-gradient(135deg, #212121 0%, #424242 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Common Pharmacy Management Problems
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Pharmacy owners face significant challenges with manual inventory tracking systems that lead to errors, inefficiencies, and missed opportunities.
            </Typography>
          </motion.div>
        </Box>

        {/* Key statistics carousel - rotates through key stats */}
        <Box 
          sx={{ 
            mb: { xs: 6, md: 8 }, 
            mx: 'auto', 
            maxWidth: 800,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '6px',
              height: '100%',
              bgcolor: 'primary.main',
              borderRadius: '3px 0 0 3px'
            }
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Info sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Industry Insight:
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative', height: 60 }}>
                {stats.map((stat, index) => (
                  <Fade 
                    key={index} 
                    in={selectedStat === index} 
                    timeout={500}
                    style={{ 
                      position: 'absolute',
                      width: '100%',
                      display: selectedStat === index ? 'block' : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography 
                        variant="h3" 
                        component="span" 
                        sx={{ 
                          fontWeight: 700, 
                          color: 'primary.dark', 
                          mr: 2 
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body1">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Fade>
                ))}
              </Box>
              {/* Navigation dots */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {stats.map((_, index) => (
                  <Box 
                    key={index}
                    component="button"
                    onClick={() => setSelectedStat(index)}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      mx: 0.5,
                      bgcolor: selectedStat === index ? 'primary.main' : 'grey.300',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: selectedStat === index ? 'primary.dark' : 'grey.400',
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Interactive problem cards */}
        <Grid
          container
          spacing={3}
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {problemCards.map((problem, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial="rest"
                whileHover="hover"
                animate={expandedCard === index ? "hover" : "rest"}
                variants={cardHover}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 1,
                    position: 'relative',
                    overflow: 'visible',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      bgcolor: problem.color,
                      borderRadius: '3px 3px 0 0'
                    }
                  }}
                //   onClick={() => handleCardClick(index)}
                >
                  <CardContent sx={{ p: 3, flexGrow:2 }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }} minHeight={240}>
                      <motion.div variants={iconAnimation}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            p: 1.5,
                            borderRadius: '50%',
                            bgcolor: `${problem.color}10`,
                            color: problem.color,
                            mb: 2
                          }}
                        >
                          {React.cloneElement(problem.icon, { 
                            sx: { fontSize: 36 } 
                          })}
                        </Box>
                      </motion.div>
                      
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          color: problem.color
                        }}
                      >
                        {problem.title}
                      </Typography>
                      
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {problem.description}
                      </Typography>
                      
                      {/* <Chip 
                        icon={<Info fontSize="small" />} 
                        label={expandedCard === index ? "Less info" : "More info"} 
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(46, 125, 50, 0.08)'
                          }
                        }}
                      /> */}
                    </Box>
                    
                    <Grow in={expandedCard === index} timeout={300}>
                      <Box 
                        sx={{ 
                          mt: 2,
                          pt: 2,
                          borderTop: '1px dashed',
                          borderColor: 'divider',
                          display: expandedCard === index ? 'block' : 'none'
                        }}
                      >
                        <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                          {problem.fullDescription}
                        </Typography>
                        
                        <Divider sx={{ mb: 2 }} />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            INDUSTRY STATISTIC
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {problem.stat}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            OUR SOLUTION
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircle sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {problem.solution}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grow>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
        {/* <ProblemSolutionTimeline/> */}
        
        {/* CTA button */}
        {/* <Box sx={{ textAlign: 'center', mt: 6 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ 
                px: 4, 
                py: 1.5,
                borderRadius: 1,
                fontSize: '1rem',
                fontWeight: 500,
                boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.6)',
                }
              }}
            >
              See How We Solve These Problems
            </Button>
          </motion.div>
        </Box> */}
      </Container>
    </Box>
  );
};

export default ProblemSection;