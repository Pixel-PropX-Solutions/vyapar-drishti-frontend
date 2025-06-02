
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  // Card,
  // CardContent,
  // CardMedia,
  Button,
  Fade,
  // Zoom,
  Paper,
  // IconButton,
  // Chip
} from '@mui/material';
import {
  Code as CodeIcon,
  BubbleChart as ProductIcon,
  Insights as InsightsIcon,
  Security as SecurityIcon,
  // LinkedIn as LinkedInIcon,
  // GitHub as GitHubIcon,
  // Twitter as TwitterIcon
} from '@mui/icons-material';

// Team member interface
// interface TeamMember {
//   id: number;
//   name: string;
//   role: string;
//   bio: string;
//   avatar: string;
//   gender: 'male' | 'female';
//   socialLinks: {
//     linkedin?: string;
//     github?: string;
//     twitter?: string;
//   };
//   skills: string[];
// }

// Company values interface
interface CompanyValue {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const AboutPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('company');
  // const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Team members data
  // const teamMembers: TeamMember[] = [
  //   {
  //     id: 1,
  //     name: 'Jinesh Prajapat',
  //     role: 'CEO & Co-Founder',
  //     bio: 'Jinesh has over 2 years of experience in SaaS product development and previously founded two successful startups in the analytics space.',
  //     avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  //     gender: 'male',
  //     socialLinks: {
  //       linkedin: 'https://www.linkedin.com/in/jinesh-prajapat',
  //       github: 'https://github.com/JineshPrajapat',
  //     },
  //     skills: ['Strategy', 'Leadership', 'Product Vision']
  //   },
  //   {
  //     id: 2,
  //     name: 'Yatin Badeja',
  //     role: 'CTO & Co-Founder',
  //     bio: 'With a Ph.D. in Computer Science, Sarah leads our technical innovation and ensures our platform remains cutting-edge and scalable.',
  //     avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  //     gender: 'female',
  //     socialLinks: {
  //       linkedin: 'https://linkedin.com/yatin-badeja',
  //       github: 'https://github.com/yatinbadeja'
  //     },
  //     skills: ['Architecture', 'AI/ML', 'Cloud Infrastructure']
  //   },
  //   {
  //     id: 3,
  //     name: 'Tohid Khan',
  //     role: 'Lead Developer',
  //     bio: 'Tohid brings 8+ years of experience in full-stack development and leads our engineering team in creating robust, scalable solutions.',
  //     avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
  //     gender: 'male',
  //     socialLinks: {
  //       linkedin: 'https://www.linkedin.com/in/tohid-khan/',
  //       github: 'https://github.com/tohidkhan2464'
  //     },
  //     skills: ['Full-Stack Development', 'TypeScript', 'DevOps']
  //   },
  //   {
  //     id: 4,
  //     name: 'Anjali Choudhary',
  //     role: 'Head of Product',
  //     bio: 'Michael transforms complex customer needs into elegant product solutions, focusing on intuitive UX and powerful functionality.',
  //     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  //     gender: 'male',
  //     socialLinks: {
  //       linkedin: 'https://linkedin.com/',
  //       twitter: 'https://twitter.com/'
  //     },
  //     skills: ['UX/UI', 'Product Management', 'Customer Research']
  //   },
  //   {
  //     id: 5,
  //     name: 'Tisha Chatrola',
  //     role: 'Head of Customer Success',
  //     bio: 'Tisha ensures our customers achieve maximum value from our platform through strategic onboarding and continuous support.',
  //     avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
  //     gender: 'female',
  //     socialLinks: {
  //       linkedin: 'https://linkedin.com/'
  //     },
  //     skills: ['Customer Support', 'Training', 'Relationship Management']
  //   },

  // ];

  // Company values data
  const companyValues: CompanyValue[] = [
    {
      icon: <ProductIcon fontSize="large" />,
      title: 'Innovation First',
      description: 'We continuously push boundaries to create solutions that transform how businesses operate.',
      color: '#6A1B9A'
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Security & Trust',
      description: 'We build on a foundation of enterprise-grade security and transparent relationships.',
      color: '#1565C0'
    },
    {
      icon: <InsightsIcon fontSize="large" />,
      title: 'Data-Driven',
      description: 'Every feature and decision is backed by data and optimized for measurable impact.',
      color: '#D84315'
    },
    {
      icon: <CodeIcon fontSize="large" />,
      title: 'Quality Code',
      description: 'We believe in clean, maintainable code that provides a solid foundation for rapid innovation.',
      color: '#2E7D32'
    }
  ];

  // Scroll animation handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle team member click
  // const handleMemberClick = (member: TeamMember) => {
  //   setSelectedMember(member);
  // };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Navigation */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolling ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: isScrolling ? 'blur(10px)' : 'none',
        boxShadow: isScrolling ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
        borderRadius: 1,
        mb: 4
      }}>
        <Grid container spacing={2} justifyContent="center" sx={{ p: 2 }}>
          <Grid item>
            <Button
              variant={activeSection === 'company' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveSection('company')}
              sx={{ borderRadius: 4 }}
            >
              Our Company
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={activeSection === 'values' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveSection('values')}
              sx={{ borderRadius: 4 }}
            >
              Our Values
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Company Section */}
      <Fade in={activeSection === 'company'} timeout={800}>
        <Box sx={{ display: activeSection === 'company' ? 'block' : 'none' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
                Transforming Business Data
              </Typography>
              <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
                We're building the next generation of data analytics tools
              </Typography>
              <Typography variant="body1" paragraph>
                Founded in 2025, our platform helps businesses transform raw data into actionable insights.
                We combine powerful analytics with intuitive design to make data accessible to everyone in your organization.
              </Typography>
              <Typography variant="body1" paragraph>
                Our team of experts has deep experience in data science, cloud infrastructure, and enterprise software,
                allowing us to create solutions that are both powerful and easy to use.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                }}
              >
                Learn More About Our Platform
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={12}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  transform: 'rotate(2deg)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(0deg) scale(1.02)'
                  }
                }}
              >
                <Box
                  sx={{
                    height: 400,
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #00897b 50%, #1565c0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                  }}
                >
                  <Typography variant="h3" component="div" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    Unlocking the Power of Your Data
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mt: 8 }}>
            {[
              { label: 'Customers', value: '500+', color: '#6A1B9A' },
              { label: 'Data Processed', value: '1.2 PB', color: '#1565C0' },
              { label: 'Countries', value: '32', color: '#D84315' },
              { label: 'Uptime', value: '99.99%', color: '#2E7D32' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderTop: `4px solid ${stat.color}`,
                    borderRadius: 1,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Typography variant="h3" component="div" fontWeight="bold" color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Values Section */}
      <Fade in={activeSection === 'values'} timeout={800}>
        <Box sx={{ display: activeSection === 'values' ? 'block' : 'none' }}>
          <Typography variant="h3" component="h2" gutterBottom align="center" color="primary" fontWeight="bold">
            Our Core Values
          </Typography>
          <Typography variant="h6" component="p" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            These principles guide everything we do, from product development to customer relationships
          </Typography>

          <Grid container spacing={4}>
            {companyValues.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 8
                    },
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 8,
                      height: '100%',
                      backgroundColor: value.color
                    }}
                  />
                  <Box sx={{ pl: 2 }}>
                    <Box sx={{ color: value.color, mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {value.title}
                    </Typography>
                    <Typography variant="body1">
                      {value.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Mission Statement */}
          <Paper
            elevation={8}
            sx={{
              mt: 8,
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(to right, rgba(106, 27, 154, 0.05), rgba(33, 150, 243, 0.1))'
            }}
          >
            <Typography variant="h4" component="h3" gutterBottom align="center" fontWeight="bold">
              Our Mission
            </Typography>
            <Typography variant="h6" component="p" align="center" sx={{ maxWidth: 800, mx: 'auto' }}>
              "To empower organizations of all sizes with accessible, actionable data insights that drive
              growth and innovation in an increasingly complex digital world."
            </Typography>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default AboutPage;
