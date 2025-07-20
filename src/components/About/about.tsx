
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Fade,
  Zoom,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  Code as CodeIcon,
  BubbleChart as ProductIcon,
  Insights as InsightsIcon,
  Security as SecurityIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

// Team member interface
interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  gender: 'male' | 'female';
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  skills: string[];
}

// Company values interface
interface CompanyValue {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const AboutPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('company');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Jinesh Prajapat',
      role: 'CEO & Co-Founder',
      bio: 'Jinesh has over 2 years of experience in SaaS product development and previously founded two successful startups in the analytics space.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      gender: 'male',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/jinesh-prajapat',
        github: 'https://github.com/JineshPrajapat',
      },
      skills: ['Strategy', 'Leadership', 'Product Vision']
    },
    {
      id: 2,
      name: 'Yatin Badeja',
      role: 'CTO & Co-Founder',
      bio: 'With a Ph.D. in Computer Science, Sarah leads our technical innovation and ensures our platform remains cutting-edge and scalable.',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      gender: 'female',
      socialLinks: {
        linkedin: 'https://linkedin.com/yatin-badeja',
        github: 'https://github.com/yatinbadeja'
      },
      skills: ['Architecture', 'AI/ML', 'Cloud Infrastructure']
    },
    {
      id: 3,
      name: 'Tohid Khan',
      role: 'Lead Developer',
      bio: 'Tohid brings 8+ years of experience in full-stack development and leads our engineering team in creating robust, scalable solutions.',
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
      gender: 'male',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/tohid-khan/',
        github: 'https://github.com/tohidkhan2464'
      },
      skills: ['Full-Stack Development', 'TypeScript', 'DevOps']
    },
    {
      id: 4,
      name: 'Anjali Choudhary',
      role: 'Head of Product',
      bio: 'Michael transforms complex customer needs into elegant product solutions, focusing on intuitive UX and powerful functionality.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      gender: 'male',
      socialLinks: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/'
      },
      skills: ['UX/UI', 'Product Management', 'Customer Research']
    },
    {
      id: 5,
      name: 'Tisha Chatrola',
      role: 'Head of Customer Success',
      bio: 'Tisha ensures our customers achieve maximum value from our platform through strategic onboarding and continuous support.',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      gender: 'female',
      socialLinks: {
        linkedin: 'https://linkedin.com/'
      },
      skills: ['Customer Support', 'Training', 'Relationship Management']
    },

  ];

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
  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

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
              variant={activeSection === 'team' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveSection('team')}
              sx={{ borderRadius: 4 }}
            >
              Meet the Team
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

      {/* Team Section */}
      <Fade in={activeSection === 'team'} timeout={800}>
        <Box sx={{ display: activeSection === 'team' ? 'block' : 'none' }}>
          <Typography variant="h3" component="h2" gutterBottom align="center" color="primary" fontWeight="bold">
            Meet Our Team
          </Typography>
          <Typography variant="h6" component="p" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            Our diverse team combines expertise in data science, engineering, design, and customer success
            to deliver an exceptional product and experience.
          </Typography>

          <Grid container spacing={4}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleMemberClick(member)}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  >
                    <Box
                      sx={{
                        height: 220,
                        background: member.gender === 'female'
                          ? 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)'
                          : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      }}
                    />
                    <CardMedia
                      component="img"
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        position: 'absolute',
                        top: 60,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '4px solid white'
                      }}
                      image={member.avatar}
                      alt={member.name}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" fontWeight="medium" gutterBottom>
                      {member.role}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                      {Object.entries(member.socialLinks).map(([platform, url]) => (
                        <IconButton
                          key={platform}
                          size="small"
                          color="primary"
                          sx={{ border: 1, borderColor: 'divider' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(url, '_blank');
                          }}>
                          {platform === 'linkedin' && <LinkedInIcon />}
                          {platform === 'github' && <GitHubIcon />}
                          {platform === 'twitter' && <TwitterIcon />}
                        </IconButton>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Team Member Modal */}
          {selectedMember && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300,
                p: 2
              }}
              onClick={() => setSelectedMember(null)}
            >
              <Zoom in={!!selectedMember}>
                <Paper
                  elevation={24}
                  sx={{
                    maxWidth: 600,
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: 4,
                    p: 4
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            mx: 'auto',
                            border: `4px solid ${selectedMember.gender === 'female' ? '#FF9800' : '#2196F3'}`
                          }}
                          image={selectedMember.avatar}
                          alt={selectedMember.name}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                          {Object.entries(selectedMember.socialLinks).map(([platform, url]) => (
                            <IconButton
                              key={platform}
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(url, '_blank');
                              }}
                            >
                              {platform === 'linkedin' && <LinkedInIcon />}
                              {platform === 'github' && <GitHubIcon />}
                              {platform === 'twitter' && <TwitterIcon />}
                            </IconButton>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h4" component="h3" gutterBottom>
                        {selectedMember.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" fontWeight="medium" gutterBottom>
                        {selectedMember.role}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {selectedMember.bio}
                      </Typography>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Key Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedMember.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            color={selectedMember.gender === 'female' ? 'warning' : 'primary'}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Zoom>
            </Box>
          )}
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

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   Avatar,
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Divider,
//   IconButton,
//   useTheme,
//   Tooltip,
//   alpha,
//   Chip,
//   CircularProgress,
//   Fade,
//   Grid,
//   LinearProgress,
//   Stack,
//   Collapse,
//   ButtonGroup,
//   CardHeader,
//   Zoom,
//   Switch,
//   FormControlLabel,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Badge,
//   SpeedDial,
//   SpeedDialAction,
//   SpeedDialIcon,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import {
//   useColorScheme,
// } from "@mui/material/styles";
// import {
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LinkedIn as LinkedInIcon,
//   Language as WebsiteIcon,
//   Facebook as FacebookIcon,
//   SecurityOutlined,
//   Check,
//   Edit as EditIcon,
//   Settings,
//   Person,
//   Shield,
//   Key,
//   Business,
//   AccessTime,
//   Star,
//   Share,
//   Download,
//   Refresh,
//   History,
//   Palette,
//   Brightness4,
//   Brightness7,
//   NotificationsActive,
//   PrivacyTip,
//   ContactSupport,
//   DeleteForever,
//   Password,
//   AddLocation,
//   BusinessSharp,
//   AccountBalance,
//   BadgeOutlined,
//   AddBusiness,
// } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import EditUserModal from "@/features/profile/EditUserModal";
// import { getCurrentUser } from "@/services/auth";
// import { getCompany } from "@/services/company";
// import { GetCompany, GetUser } from "@/utils/types";
// import { formatDatewithTime } from "@/utils/functions";

// // Enhanced Password Strength Meter with micro-interactions
// const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
//   const theme = useTheme();
//   const [animatedValue, setAnimatedValue] = useState(0);

//   const getStrength = (password: string) => {
//     const checks = [
//       { test: password.length >= 8, label: "8+ characters", icon: <Key fontSize="small" /> },
//       { test: /[A-Z]/.test(password), label: "Uppercase", icon: <Typography variant="caption" sx={{ fontWeight: 'bold' }}>A</Typography> },
//       { test: /[a-z]/.test(password), label: "Lowercase", icon: <Typography variant="caption">a</Typography> },
//       { test: /[0-9]/.test(password), label: "Number", icon: <Typography variant="caption" sx={{ fontWeight: 'bold' }}>1</Typography> },
//       { test: /[^A-Za-z0-9]/.test(password), label: "Special char", icon: <Typography variant="caption" sx={{ fontWeight: 'bold' }}>@</Typography> },
//     ];

//     let strength = 0;
//     if (!password) {
//       return { value: 0, label: "None", color: theme.palette.grey[400], bg: theme.palette.grey[100], checks };
//     }

//     strength = checks.filter(check => check.test).length;

//     const strengthMap = [
//       { value: 0, label: "None", color: theme.palette.grey[400], bg: theme.palette.grey[100] },
//       { value: 1, label: "Very Weak", color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) },
//       { value: 2, label: "Weak", color: '#ff6b35', bg: alpha('#ff6b35', 0.1) },
//       { value: 3, label: "Fair", color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) },
//       { value: 4, label: "Good", color: theme.palette.info.main, bg: alpha(theme.palette.info.main, 0.1) },
//       { value: 5, label: "Strong", color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) },
//     ];

//     return { ...strengthMap[strength], checks };
//   };

//   const strength = getStrength(password);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setAnimatedValue((strength.value / 5) * 100);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, [strength.value]);

//   return (
//     <Fade in={!!password} timeout={400}>
//       <Box sx={{ width: "100%", mt: 2, mb: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
//           <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5 }}>
//             Password Strength
//           </Typography>
//           <Zoom in={!!password} timeout={300}>
//             <Chip
//               label={strength.label}
//               size="small"
//               sx={{
//                 bgcolor: strength.bg,
//                 color: strength.color,
//                 fontWeight: 700,
//                 minWidth: 85,
//                 height: 32,
//                 fontSize: '0.75rem',
//                 border: `2px solid ${alpha(strength.color, 0.4)}`,
//                 boxShadow: `0 2px 8px ${alpha(strength.color, 0.2)}`,
//                 transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
//               }}
//             />
//           </Zoom>
//         </Box>

//         <Box sx={{ position: 'relative', mb: 2 }}>
//           <LinearProgress
//             variant="determinate"
//             value={100}
//             sx={{
//               height: 10,
//               borderRadius: 5,
//               bgcolor: alpha(theme.palette.divider, 0.15),
//             }}
//           />
//           <LinearProgress
//             variant="determinate"
//             value={animatedValue}
//             sx={{
//               height: 10,
//               borderRadius: 5,
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               "& .MuiLinearProgress-bar": {
//                 borderRadius: 5,
//                 bgcolor: strength.color,
//                 transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//                 boxShadow: `0 0 10px ${alpha(strength.color, 0.4)}`,
//               },
//             }}
//           />
//         </Box>

//         <Collapse in={!!password && password.length > 0}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 2,
//               bgcolor: alpha(theme.palette.background.default, 0.5),
//               borderRadius: 1,
//               border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//             }}
//           >
//             <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, display: 'block' }}>
//               Requirements
//             </Typography>
//             <Grid container spacing={1.5}>
//               {strength.checks?.map((check, index) => (
//                 <Grid item xs={12} sm={6} key={index}>
//                   <Zoom in={true} timeout={200 + index * 100}>
//                     <Box sx={{ display: "flex", alignItems: "center", py: 0.5 }}>
//                       <Box
//                         sx={{
//                           width: 24,
//                           height: 24,
//                           borderRadius: "50%",
//                           bgcolor: check.test ? theme.palette.success.main : alpha(theme.palette.grey[400], 0.2),
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           mr: 1.5,
//                           transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
//                           transform: check.test ? 'scale(1.1)' : 'scale(1)',
//                           boxShadow: check.test ? `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}` : 'none',
//                         }}
//                       >
//                         {check.test ? (
//                           <Check sx={{ fontSize: 14, color: "white" }} />
//                         ) : (
//                           <Box sx={{ color: theme.palette.grey[400], fontSize: 12 }}>{check.icon}</Box>
//                         )}
//                       </Box>
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: check.test ? theme.palette.success.main : "text.secondary",
//                           fontSize: "0.75rem",
//                           fontWeight: check.test ? 600 : 400,
//                           transition: "color 0.3s ease",
//                         }}
//                       >
//                         {check.label}
//                       </Typography>
//                     </Box>
//                   </Zoom>
//                 </Grid>
//               ))}
//             </Grid>
//           </Paper>
//         </Collapse>
//       </Box>
//     </Fade>
//   );
// };

// // Enhanced Info Row with better animations
// const InfoRow: React.FC<{
//   icon: React.ReactNode;
//   label: string;
//   value: React.ReactNode;
//   // isEditing?: boolean;
//   // onEdit?: () => void;
//   badge?: number;
// }> = ({ icon, label, value, badge }) => {
//   const theme = useTheme();
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Paper
//       elevation={0}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       sx={{
//         py: 2,
//         px: 1,
//         mb: 1,
//         borderRadius: 1,
//         background: hovered
//           ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
//           : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
//         backdropFilter: "blur(20px)",
//         border: `1px solid ${hovered ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.08)}`,
//         transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//         transform: hovered ? "translateY(-4px)" : "translateY(0)",
//         boxShadow: hovered
//           ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`
//           : `0 2px 8px ${alpha(theme.palette.primary.main, 0.05)}`,
//       }}
//     >
//       <Box display="flex" alignItems="center" justifyContent="start">
//         <Box display="flex" alignItems="center" flex={1}>
//           <Badge badgeContent={badge} color="error" sx={{ mr: 1 }}>
//             <Box
//               sx={{
//                 p: 1,
//                 borderRadius: 2.5,
//                 bgcolor: hovered
//                   ? alpha(theme.palette.primary.main, 0.15)
//                   : alpha(theme.palette.primary.main, 0.1),
//                 color: theme.palette.primary.main,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "all 0.3s ease",
//                 transform: hovered ? 'scale(1.1)' : 'scale(1)',
//               }}
//             >
//               {icon}
//             </Box>
//           </Badge>
//           <Box flex={1}>
//             <Typography
//               variant="caption"
//               sx={{
//                 color: "text.secondary",
//                 fontWeight: 500,
//                 textTransform: "uppercase",
//                 letterSpacing: 1,
//                 fontSize: "0.5rem",
//               }}
//             >
//               {label}
//             </Typography>
//             <Typography
//               variant="body2"
//               component="span"
//               sx={{ fontWeight: 600, mt: 0.5, fontSize: '.8rem' }}
//             >
//               {value}
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// };

// // Enhanced Profile Header with floating action button
// const ProfileHeader: React.FC<{
//   user: GetUser | null;
//   company: GetCompany | null;
//   tabValue: number;
//   onEditToggle: () => void;
// }> = ({ user, onEditToggle, tabValue, company }) => {
//   const theme = useTheme();

//   const getUserInitials = () => {
//     if (!user?.name) return 'TK';
//     const { first, last } = user.name;
//     return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
//   };

//   const getCompanyInitials = () => {
//     if (!company?.company_name) return 'TK';
//     const companyName = company.company_name.split(" ");
//     const first = companyName[0];
//     const last = companyName[companyName.length - 1];
//     return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
//   };


//   return (
//     <Card
//       elevation={0}
//       sx={{
//         background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//         color: "white",
//         borderRadius: 4,
//         overflow: "hidden",
//       }}
//     >
//       <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
//           <Box>
//             <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1, mb: 1 }}>
//               {tabValue !== 1 ? "My Profile" : "Company Profile"}
//             </Typography>
//             <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 400 }}>
//               {tabValue !== 1 ? "Manage your account settings and details" : "View and edit your company details"}
//             </Typography>
//           </Box>
//           <ButtonGroup
//             variant="contained"
//             sx={{
//               bgcolor: alpha("hsl(0, 0%, 100%)", 0.15),
//               border: `1px solid ${alpha("hsl(0, 0%, 100%)", 0.2)}`,
//             }}
//           >
//             <Button
//               onClick={onEditToggle}
//               startIcon={<EditIcon />}
//               sx={{
//                 fontWeight: 600,
//                 px: 3,
//               }}
//             >
//               {tabValue !== 1 ? "Edit Profile" : ' Edit Company'}
//             </Button>
//           </ButtonGroup>
//         </Box>

//         <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={6}>
//           <Box position="relative">
//             {tabValue !== 1 ? (<>
//               {(user?.image !== '' && typeof user?.image === 'string') ? (
//                 <img
//                   src={typeof user?.image === 'string' ? user?.image : ''}
//                   alt={user?.name?.first}
//                   style={{
//                     width: 140,
//                     height: 140,
//                     borderRadius: "50%",
//                     objectFit: "cover",
//                     boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
//                   }}
//                 />) : (
//                 <Avatar
//                   alt={`${user?.name?.first} ${user?.name?.last}`}
//                   sx={{
//                     width: 140,
//                     height: 140,
//                     bgcolor: theme.palette.primary.main,
//                     color: "white",
//                     fontSize: "3rem",
//                     border: "4px solid rgba(255,255,255,0.3)",
//                     boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       transform: "scale(1.05)",
//                       boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
//                     }
//                   }}
//                 >
//                   {getUserInitials()}
//                 </Avatar>
//               )}</>) : (
//               <>
//                 {(company?.image !== '' && typeof company?.image === 'string') ? (
//                   <img
//                     src={typeof company?.image === 'string' ? company?.image : ''}
//                     alt={company?.company_name}
//                     style={{
//                       width: 140,
//                       height: 140,
//                       borderRadius: "50%",
//                       objectFit: "cover",
//                       boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
//                     }}
//                   />) : (
//                   <Avatar
//                     alt={company?.company_name}
//                     sx={{
//                       width: 140,
//                       height: 140,
//                       bgcolor: theme.palette.primary.main,
//                       color: "white",
//                       fontSize: "3rem",
//                       border: "4px solid rgba(255,255,255,0.3)",
//                       boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         transform: "scale(1.05)",
//                         boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
//                       }
//                     }}
//                   >
//                     {getCompanyInitials()}
//                   </Avatar>
//                 )}</>
//             )}
//           </Box>

//           <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
//             {tabValue !== 1 ?
//               (<Typography
//                 variant="h2"
//                 sx={{
//                   fontWeight: 800,
//                   mb: 2,
//                   fontSize: { xs: '2rem', md: '2.5rem' },
//                   letterSpacing: -1,
//                 }}
//               >
//                 {user?.name?.first} {user?.name?.last}
//               </Typography>) :
//               (<Typography
//                 variant="h2"
//                 sx={{
//                   fontWeight: 800,
//                   mb: 2,
//                   fontSize: { xs: '2rem', md: '2.5rem' },
//                   letterSpacing: -1,
//                 }}
//               >
//                 {company?.company_name}
//               </Typography>)}

//             <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }} mb={3}>
//               <Chip
//                 label={user?.user_type === 'admin' ? "Admin" : user?.user_type === 'user' ? "User" : "Guest"}
//                 icon={<Business fontSize="small" />}
//                 sx={{
//                   bgcolor: alpha("hsl(0, 0%, 100%)", 0.2),
//                   color: "white",
//                   fontWeight: 700,
//                   fontSize: '0.9rem',
//                   height: 36,
//                   border: `2px solid ${alpha("hsl(0, 0%, 100%)", 0.3)}`,
//                   backdropFilter: 'blur(10px)',
//                 }}
//               />
//               <Chip
//                 label="Premium"
//                 icon={<Star fontSize="small" />}
//                 sx={{
//                   bgcolor: alpha(theme.palette.warning.main, 0.2),
//                   color: theme.palette.warning.main,
//                   fontWeight: 700,
//                   fontSize: '0.9rem',
//                   height: 36,
//                   border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
//                   backdropFilter: 'blur(10px)',
//                 }}
//               />
//             </Stack>

//             <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }}>
//               {[
//                 { Icon: LinkedInIcon, color: '#0077B5', label: 'LinkedIn' },
//                 { Icon: FacebookIcon, color: '#1877F2', label: 'Facebook' },
//                 { Icon: WebsiteIcon, color: '#4CAF50', label: 'Website' }
//               ].map(({ Icon, color, label }, index) => (
//                 <Tooltip key={index} title={label} arrow>
//                   <IconButton
//                     sx={{
//                       bgcolor: alpha("hsl(0, 0%, 100%)", 0.15),
//                       color: "white",
//                       width: 48,
//                       height: 48,
//                       backdropFilter: 'blur(10px)',
//                       border: `1px solid ${alpha("hsl(0, 0%, 100%)", 0.2)}`,
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         bgcolor: alpha(color, 0.2),
//                         transform: "translateY(-2px) scale(1.05)",
//                         boxShadow: `0 8px 20px ${alpha(color, 0.3)}`,
//                       },
//                     }}
//                   >
//                     <Icon />
//                   </IconButton>
//                 </Tooltip>
//               ))}
//             </Stack>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// // Enhanced Settings Card
// const SettingsCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({
//   title,
//   children,
//   icon
// }) => {
//   const theme = useTheme();
//   // const [expanded, setExpanded] = useState(true);

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         borderRadius: 1,
//         m: 0,
//         p: 1,
//         background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
//         backdropFilter: "blur(20px)",
//         border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
//         overflow: "hidden",
//         transition: "all 0.3s ease",
//         "&:hover": {
//           border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
//           boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
//         }
//       }}
//     >
//       <CardHeader
//         avatar={
//           <Box
//             sx={{
//               p: 1,
//               bgcolor: alpha(theme.palette.primary.main, 0.1),
//               borderRadius: 1,
//               color: theme.palette.primary.main,
//             }}
//           >
//             {icon}
//           </Box>
//         }
//         title={
//           <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
//             {title}
//           </Typography>
//         }
//         sx={{ pb: 1 }}
//       />
//       <CardContent sx={{ pt: 0 }}>
//         {children}
//       </CardContent>
//     </Card>
//   );
// };

// // Main Enhanced Component
// const AboutPage: React.FC = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const { mode, setMode } = useColorScheme();

//   const { user } = useSelector((state: RootState) => state.auth)
//   const { company } = useSelector((state: RootState) => state.company)

//   const [isUserEditing, setIsUserEditing] = useState(false);
//   const [isCompanyEditing, setIsCompanyEditing] = useState(false);
//   const [isBillingEditing, setIsBillingEditing] = useState(false);
//   const [isShippingEditing, setIsShippingEditing] = useState(false);

//   const [password, setPassword] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const [notifications, setNotifications] = useState({
//     email: true,
//     push: false,
//     sms: true,
//   });
//   const [tabValue, setTabValue] = useState(0);
//   const [speedDialOpen, setSpeedDialOpen] = useState(false);

//   const speedDialActions = [
//     { icon: <Download />, name: 'Download Profile', action: () => {} },
//     { icon: <Share />, name: 'Share Profile', action: () => {} },
//     { icon: <Refresh />, name: 'Refresh Data', action: () =>{} },
//     { icon: <ContactSupport />, name: 'Get Help', action: () => {} },
//   ];

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     if (newValue === 1) {
//       dispatch(getCompany());
//     }
//     setTabValue(newValue);
//   };

//   const fetchUserData = () => {
//     dispatch(getCurrentUser());
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.secondary.light, 0.04)} 100%)`,
//         overflow: "hidden",
//         width: "100%",
//       }}
//     >
//       <Container sx={{ position: "relative", width: '100%', zIndex: 1, py: 4 }}>
//         <Stack spacing={2}>

//           {/* Enhanced Profile Header */}
//           <ProfileHeader
//             user={user}
//             company={company}
//             tabValue={tabValue}
//             onEditToggle={() => setIsUserEditing(!isUserEditing)}
//           />

//           {/* Tab Navigation */}
//           <Paper
//             elevation={0}
//             sx={{
//               borderRadius: 1,
//               bgcolor: alpha(theme.palette.background.paper, 0.8),
//               backdropFilter: "blur(20px)",
//             }}
//           >
//             <Tabs
//               value={tabValue}
//               onChange={handleTabChange}
//               variant="fullWidth"
//               sx={{
//                 "& .MuiTab-root": {
//                   fontWeight: 600,
//                   textTransform: "none",
//                   fontSize: "1rem",
//                   py: 2,
//                 },
//               }}
//             >
//               <Tab label="Personal Info" icon={<Person />} iconPosition="start" />
//               <Tab label="Company Info" icon={<BusinessSharp />} iconPosition="start" />
//               <Tab label="Security" icon={<Shield />} iconPosition="start" />
//               <Tab label="Preferences" icon={<Settings />} iconPosition="start" />
//             </Tabs>
//           </Paper>

//           {/* Tab Content */}
//           {tabValue === 0 && (
//             <Grid container gap={2} sx={{ mt: 2 }}>
//               {/* Contact Information */}
//               <Grid item xs={12} lg={4}>
//                 <SettingsCard title="Contact Information" icon={<EmailIcon />}>
//                   <Stack spacing={2}>
//                     <InfoRow
//                       icon={<EmailIcon />}
//                       label="Email Address"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {user?.email}
//                         </Box>
//                       }
//                       badge={1}
//                     />
//                     <InfoRow
//                       icon={<PhoneIcon />}
//                       label="Phone Number"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {user?.phone?.number || 'Not provided'}
//                         </Box>
//                       }
//                     />
//                     <InfoRow
//                       icon={<AccessTime />}
//                       label="Member Since"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {formatDatewithTime(user?.created_at ?? '')}
//                         </Box>
//                       }
//                     />
//                   </Stack>
//                 </SettingsCard>
//               </Grid>

//               {/* Account Statistics */}
//               <Grid item xs={12} lg={7} >
//                 <SettingsCard title="Password & Security" icon={<SecurityOutlined />}>
//                   <Stack spacing={3} sx={{ p: 1 }}>
//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           mb: 2,
//                           fontWeight: 600,
//                           textDecoration: "underline",
//                           textUnderlineOffset: "4px",
//                         }}
//                       >
//                         Change Password
//                       </Typography>
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           p: 3,
//                           borderRadius: 1,
//                           bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.success.light, 0.1),
//                           border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
//                         }}
//                       >
//                         <Box display="flex" alignItems="center" justifyContent="space-between">
//                           <Box display="flex" alignItems="center">
//                             <Box
//                               sx={{
//                                 p: 1,
//                                 borderRadius: 1,
//                                 bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.1),
//                                 color: mode === 'light' ? theme.palette.success.main : theme.palette.success.light,
//                                 mr: 2,
//                               }}
//                             >
//                               <Password />
//                             </Box>
//                             <Box>
//                               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                 Want to Change Your Password?
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Update your password to keep your account secure.
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Box display="flex" alignItems="center" justifyContent="center" >
//                             <Button
//                               variant="contained"
//                               color="success"
//                               // onClick={onEditToggle}
//                               startIcon={<Password />}
//                               sx={{
//                                 background: mode === 'light' ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.success.light, 0.5),
//                                 "&:hover": {
//                                   background: mode === 'light' ? alpha(theme.palette.success.main, 1) : alpha(theme.palette.success.light, 1),
//                                 },
//                                 fontWeight: 600,
//                                 whiteSpace: "nowrap",
//                                 px: 3,
//                               }}
//                             >
//                               Change
//                             </Button>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     </Box>

//                     <Divider sx={{ my: 1 }} />

//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           mb: 2,
//                           fontWeight: 600,
//                           color: theme.palette.error.light,
//                           textDecoration: "underline",
//                           textUnderlineOffset: "4px",
//                         }}
//                       >
//                         Danger Zone
//                       </Typography>
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           p: 3,
//                           borderRadius: 1,
//                           bgcolor: alpha(theme.palette.error.light, 0.05),
//                           border: `1px solid ${alpha(theme.palette.error.light, 0.2)}`,
//                         }}
//                       >
//                         <Box display="flex" alignItems="center" justifyContent="space-between">
//                           <Box display="flex" alignItems="center">
//                             <Box
//                               sx={{
//                                 p: 1,
//                                 borderRadius: 1,
//                                 bgcolor: alpha(theme.palette.error.light, 0.1),
//                                 color: theme.palette.error.light,
//                                 mr: 1,
//                               }}
//                             >
//                               <DeleteForever />
//                             </Box>
//                             <Box>
//                               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                 Want to Delete Your Account Permanently?
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Your request will be processed within 5-7 business days.
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Box display="flex" alignItems="center" justifyContent="center" >
//                             <Button
//                               variant="contained"
//                               color="error"
//                               // onClick={onEditToggle}
//                               startIcon={<DeleteForever />}
//                               sx={{
//                                 background: alpha(theme.palette.error.light, 0.5),
//                                 "&:hover": {
//                                   background: alpha(theme.palette.error.light, 1),
//                                 },
//                                 fontWeight: 600,
//                                 whiteSpace: "nowrap",
//                                 px: 3,
//                               }}
//                             >
//                               Delete
//                             </Button>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     </Box>
//                   </Stack>
//                 </SettingsCard>
//               </Grid>
//             </Grid>
//           )}

//           {tabValue === 1 && (
//             <Grid container gap={2} sx={{ mt: 2 }}>
//               <Grid item xs={12} lg={4}>
//                 <SettingsCard title="Company Information" icon={<BusinessSharp />}>
//                   <Stack spacing={2}>
//                     <InfoRow
//                       icon={<EmailIcon />}
//                       label="Email Address"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {company?.email || 'Not provided'}
//                         </Box>
//                       }
//                     />
//                     <InfoRow
//                       icon={<PhoneIcon />}
//                       label="Phone Number"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {company?.phone?.code || ''} {" "}
//                           {company?.phone?.number || 'Not provided'}
//                         </Box>
//                       }
//                     />
//                     <InfoRow
//                       icon={<AccountBalance />}
//                       label="GST Number"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {company?.gstin || 'Not provided'}
//                         </Box>
//                       }
//                     />
//                     <InfoRow
//                       icon={<WebsiteIcon />}
//                       label="Phone Number"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {company?.website || 'Not provided'}
//                         </Box>
//                       }
//                     />
//                     <InfoRow
//                       icon={<AccessTime />}
//                       label="Member Since"
//                       value={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           {formatDatewithTime(company?.created_at ?? '')}
//                         </Box>
//                       }
//                     />
//                   </Stack>
//                 </SettingsCard>
//               </Grid>

//               <Grid item xs={12} lg={7} >
//                 <SettingsCard title="Address Details" icon={<AddLocation />}>
//                   <Stack spacing={3} sx={{ p: 1 }}>
//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           mb: 2,
//                           fontWeight: 600,
//                           textDecoration: "underline",
//                           textUnderlineOffset: "4px",
//                         }}
//                       >
//                         Billing Address
//                       </Typography>
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           p: 3,
//                           borderRadius: 1,
//                           bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.success.light, 0.1),
//                           border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
//                         }}
//                       >
//                         {
//                           company?.billing ? (
//                             <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                               {company.billing.address_1
//                                 ? company.billing.address_1
//                                 : <span style={{ color: '#aaa' }}>Address 1 not provided</span>}
//                               {company.billing.address_2
//                                 ? `, ${company.billing.address_2}`
//                                 : ''}
//                               {company.billing.city
//                                 ? `, ${company.billing.city}`
//                                 : ''}
//                               {company.billing.state
//                                 ? `, ${company.billing.state}`
//                                 : ''}
//                               {company.billing.country
//                                 ? `, ${company.billing.country}`
//                                 : ''}
//                               {company.billing.pinCode
//                                 ? ` - ${company.billing.pinCode}`
//                                 : ''}
//                               {
//                                 !company.billing.address_1 &&
//                                 !company.billing.address_2 &&
//                                 !company.billing.city &&
//                                 !company.billing.state &&
//                                 !company.billing.country &&
//                                 !company.billing.pinCode && (
//                                   <span style={{ color: '#aaa' }}>No billing address provided</span>
//                                 )
//                               }
//                             </Typography>
//                           ) : (
//                             <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#aaa' }}>
//                               No billing address provided
//                             </Typography>
//                           )
//                         }
//                         <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
//                           <Box display="flex" alignItems="center">
//                             <Box
//                               sx={{
//                                 p: 1,
//                                 borderRadius: 1,
//                                 bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.1),
//                                 color: mode === 'light' ? theme.palette.success.main : theme.palette.success.light,
//                                 mr: 2,
//                               }}
//                             >
//                               <AddBusiness />
//                             </Box>
//                             <Box>
//                               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                 Want to Change Your Billing Address?
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Update your billing address to ensure accurate invoicing.
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Box display="flex" alignItems="center" justifyContent="center" >
//                             <Button
//                               variant="contained"
//                               color="success"
//                               // onClick={onEditToggle}
//                               startIcon={<AddBusiness />}
//                               sx={{
//                                 background: mode === 'light' ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.success.light, 0.5),
//                                 "&:hover": {
//                                   background: mode === 'light' ? alpha(theme.palette.success.main, 1) : alpha(theme.palette.success.light, 1),
//                                 },
//                                 fontWeight: 600,
//                                 whiteSpace: "nowrap",
//                                 px: 3,
//                               }}
//                             >
//                               Change
//                             </Button>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     </Box>

//                     <Divider sx={{ my: 1 }} />

//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           mb: 2,
//                           fontWeight: 600,
//                           textDecoration: "underline",
//                           textUnderlineOffset: "4px",
//                         }}
//                       >
//                         Shipping Address
//                       </Typography>
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           p: 3,
//                           borderRadius: 1,
//                           bgcolor: mode === 'light' ? alpha(theme.palette.secondary.main, 0.05) : alpha(theme.palette.secondary.light, 0.1),
//                           border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
//                         }}
//                       >
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//                           {company?.shipping?.title ? company?.shipping?.title : 'No Shipping Title Provided'}
//                         </Typography>
//                         {
//                           company?.shipping ? (
//                             <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                               {company.shipping.address_1
//                                 ? company.shipping.address_1
//                                 : <span style={{ color: '#aaa' }}>Address 1 not provided</span>}
//                               {company.shipping.address_2
//                                 ? `, ${company.shipping.address_2}`
//                                 : ''}
//                               {company.shipping.city
//                                 ? `, ${company.shipping.city}`
//                                 : ''}
//                               {company.shipping.state
//                                 ? `, ${company.shipping.state}`
//                                 : ''}
//                               {company.shipping.country
//                                 ? `, ${company.shipping.country}`
//                                 : ''}
//                               {company.shipping.pinCode
//                                 ? ` - ${company.shipping.pinCode}`
//                                 : ''}
//                               {
//                                 !company.shipping.address_1 &&
//                                 !company.shipping.address_2 &&
//                                 !company.shipping.city &&
//                                 !company.shipping.state &&
//                                 !company.shipping.country &&
//                                 !company.shipping.pinCode && (
//                                   <span style={{ color: '#aaa' }}>No shipping address provided</span>
//                                 )
//                               }
//                             </Typography>
//                           ) : (
//                             <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#aaa' }}>
//                               No shipping address provided
//                             </Typography>
//                           )
//                         }
//                         <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
//                           <Box display="flex" alignItems="center">
//                             <Box
//                               sx={{
//                                 p: 1,
//                                 borderRadius: 1,
//                                 bgcolor: mode === 'light' ? alpha(theme.palette.secondary.main, 0.1) : alpha(theme.palette.secondary.light, 0.1),
//                                 color: mode === 'light' ? theme.palette.secondary.main : theme.palette.secondary.light,
//                                 mr: 2,
//                               }}
//                             >
//                               <AddBusiness />
//                             </Box>
//                             <Box>
//                               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                 Want to Change Your Shipping Address?
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Update your shipping address to ensure accurate deliveries.
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Box display="flex" alignItems="center" justifyContent="center" >
//                             <Button
//                               variant="contained"
//                               color="secondary"
//                               // onClick={onEditToggle}
//                               startIcon={<AddBusiness />}
//                               sx={{
//                                 background: mode === 'light' ? alpha(theme.palette.secondary.main, 0.5) : alpha(theme.palette.secondary.light, 0.5),
//                                 "&:hover": {
//                                   background: mode === 'light' ? alpha(theme.palette.secondary.main, 1) : alpha(theme.palette.secondary.light, 1),

//                                 },
//                                 border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
//                                 fontWeight: 600,
//                                 whiteSpace: "nowrap",
//                                 px: 3,
//                               }}
//                             >
//                               Change
//                             </Button>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     </Box>
//                   </Stack>
//                 </SettingsCard>
//               </Grid>


//               {/* <Grid item xs={12} lg={6}>
//                 <SettingsCard title="Account Statistics" icon={<Dashboard />}>
//                   <Grid container spacing={3}>
//                     {[
//                       { label: "Profile Views", value: 1247, icon: <Visibility />, color: theme.palette.primary.main },
//                       { label: "Connections", value: 432, icon: <Person />, color: theme.palette.success.main },
//                       { label: "Projects", value: 28, icon: <Business />, color: theme.palette.warning.main },
//                       { label: "Reviews", value: 89, icon: <Star />, color: theme.palette.info.main },
//                     ].map((stat, index) => (
//                       <Grid item xs={6} key={index}>
//                         <Paper
//                           elevation={0}
//                           sx={{
//                             p: 2.5,
//                             textAlign: 'center',
//                             borderRadius: 1,
//                             background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
//                             border: `1px solid ${alpha(stat.color, 0.2)}`,
//                             transition: "all 0.3s ease",
//                             "&:hover": {
//                               transform: "translateY(-4px)",
//                               boxShadow: `0 8px 25px ${alpha(stat.color, 0.2)}`,
//                             }
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               width: 48,
//                               height: 48,
//                               borderRadius: "50%",
//                               bgcolor: alpha(stat.color, 0.1),
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               mx: "auto",
//                               mb: 1.5,
//                               color: stat.color,
//                             }}
//                           >
//                             {stat.icon}
//                           </Box>
//                           <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
//                             {stat.value.toLocaleString()}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
//                             {stat.label}
//                           </Typography>
//                         </Paper>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </SettingsCard>
//               </Grid> */}
//               {/* 
//                     <Box>
//                       <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
//                         Update Password
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         label="New Password"
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter a strong password"
//                         sx={{
//                           mb: 2,
//                           "& .MuiOutlinedInput-root": {
//                             borderRadius: 1,
//                           }
//                         }}
//                       />
//                       <PasswordStrengthMeter password={password} />
//                     </Box>

//                     <Divider sx={{ my: 3 }} />

//                     <Box>
//                       <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
//                         Two-Factor Authentication
//                       </Typography>
//                       <Paper
//                         elevation={0}
//                         sx={{
//                           p: 3,
//                           borderRadius: 1,
//                           bgcolor: alpha(theme.palette.success.main, 0.05),
//                           border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
//                         }}
//                       >
//                         <Box display="flex" alignItems="center" justifyContent="space-between">
//                           <Box display="flex" alignItems="center">
//                             <Box
//                               sx={{
//                                 p: 1.5,
//                                 borderRadius: 1,
//                                 bgcolor: alpha(theme.palette.success.main, 0.1),
//                                 color: theme.palette.success.main,
//                                 mr: 2,
//                               }}
//                             >
//                               <VpnKey />
//                             </Box>
//                             <Box>
//                               <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                 2FA Enabled
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Your account is protected with two-factor authentication
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Switch checked={true} color="success" />
//                         </Box>
//                       </Paper>
//                     </Box>

//                     <Box>
//                       <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
//                         Login History
//                       </Typography>
//                       <List>
//                         {[
//                           { device: "MacBook Pro", location: "San Francisco, CA", time: "2 hours ago", current: true },
//                           { device: "iPhone 14", location: "San Francisco, CA", time: "1 day ago", current: false },
//                           { device: "Chrome Browser", location: "Oakland, CA", time: "3 days ago", current: false },
//                         ].map((session, index) => (
//                           <ListItem
//                             key={index}
//                             sx={{
//                               borderRadius: 1,
//                               mb: 1,
//                               bgcolor: session.current ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
//                               border: session.current ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
//                             }}
//                           >
//                             <ListItemIcon>
//                               <Box
//                                 sx={{
//                                   p: 1,
//                                   borderRadius: 1.5,
//                                   bgcolor: session.current ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[400], 0.1),
//                                   color: session.current ? theme.palette.primary.main : theme.palette.grey[600],
//                                 }}
//                               >
//                                 <History fontSize="small" />
//                               </Box>
//                             </ListItemIcon>
//                             <ListItemText
//                               primary={
//                                 <Box display="flex" alignItems="center" gap={1}>
//                                   {session.device}
//                                   {session.current && <Chip label="Current" size="small" color="primary" />}
//                                 </Box>
//                               }
//                               secondary={`${session.location} • ${session.time}`}
//                             />
//                           </ListItem>
//                         ))}
//                       </List>
//                     </Box> */}
//               {/* Security Recommendations */}
//               {/* <Grid item xs={12} lg={4}>
//                 <SettingsCard title="Security Tips" icon={<PrivacyTip />}>
//                   <Stack spacing={2}>
//                     {[
//                       {
//                         icon: <Key />,
//                         title: "Strong Password",
//                         description: "Use a unique, complex password",
//                         status: "completed",
//                         color: theme.palette.success.main,
//                       },
//                       {
//                         icon: <VpnKey />,
//                         title: "Two-Factor Auth",
//                         description: "Enable 2FA for extra security",
//                         status: "completed",
//                         color: theme.palette.success.main,
//                       },
//                       {
//                         icon: <VpnKey />,
//                         title: "Recovery Keys",
//                         description: "Set up account recovery options",
//                         status: "pending",
//                         color: theme.palette.warning.main,
//                       },
//                     ].map((tip, index) => (
//                       <Paper
//                         key={index}
//                         elevation={0}
//                         sx={{
//                           p: 2.5,
//                           borderRadius: 2.5,
//                           bgcolor: alpha(tip.color, 0.05),
//                           border: `1px solid ${alpha(tip.color, 0.2)}`,
//                         }}
//                       >
//                         <Box display="flex" alignItems="start" gap={2}>
//                           <Box
//                             sx={{
//                               p: 1,
//                               borderRadius: 1.5,
//                               bgcolor: alpha(tip.color, 0.1),
//                               color: tip.color,
//                             }}
//                           >
//                             {tip.icon}
//                           </Box>
//                           <Box flex={1}>
//                             <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
//                               {tip.title}
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                               {tip.description}
//                             </Typography>
//                             <Box mt={1}>
//                               <Chip
//                                 label={tip.status === 'completed' ? 'Completed' : 'Pending'}
//                                 size="small"
//                                 color={tip.status === 'completed' ? 'success' : 'warning'}
//                                 variant="outlined"
//                               />
//                             </Box>
//                           </Box>
//                         </Box>
//                       </Paper>
//                     ))}
//                   </Stack>
//                 </SettingsCard>
//               </Grid> */}
//             </Grid>
//           )}

//           {tabValue === 2 && (
//             <Grid container spacing={4}>
//               {/* Notification Preferences */}
//               <Grid item xs={12} lg={6}>
//                 <SettingsCard title="Notification Preferences" icon={<NotificationsActive />}>
//                   <Stack spacing={3}>
//                     {Object.entries(notifications).map(([key, value]) => (
//                       <Box key={key}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={value}
//                               onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
//                               color="primary"
//                             />
//                           }
//                           label={
//                             <Box>
//                               <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
//                                 {key} Notifications
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Receive notifications via {key}
//                               </Typography>
//                             </Box>
//                           }
//                           sx={{ width: '100%', margin: 0 }}
//                         />
//                         <Divider sx={{ mt: 2 }} />
//                       </Box>
//                     ))}
//                   </Stack>
//                 </SettingsCard>
//               </Grid>

//               {/* Theme Preferences */}
//               <Grid item xs={12} lg={6}>
//                 <SettingsCard title="Appearance" icon={<Palette />}>
//                   <Stack spacing={3}>
//                     <Box>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={darkMode}
//                             onChange={(e) => setDarkMode(e.target.checked)}
//                             color="primary"
//                           />
//                         }
//                         label={
//                           <Box display="flex" alignItems="center" gap={1}>
//                             {darkMode ? <Brightness4 /> : <Brightness7 />}
//                             <Box>
//                               <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                 Dark Mode
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Switch between light and dark themes
//                               </Typography>
//                             </Box>
//                           </Box>
//                         }
//                         sx={{ width: '100%', margin: 0 }}
//                       />
//                     </Box>

//                     <Divider />

//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
//                         Color Themes
//                       </Typography>
//                       <Grid container spacing={2}>
//                         {[
//                           { name: 'Blue', color: '#1976d2' },
//                           { name: 'Green', color: '#388e3c' },
//                           { name: 'Purple', color: '#7b1fa2' },
//                           { name: 'Orange', color: '#f57c00' },
//                         ].map((themeColor, index) => (
//                           <Grid item xs={3} key={index}>
//                             <Tooltip title={themeColor.name}>
//                               <IconButton
//                                 sx={{
//                                   width: 48,
//                                   height: 48,
//                                   bgcolor: themeColor.color,
//                                   border: index === 0 ? `3px solid ${theme.palette.primary.main}` : 'none',
//                                   "&:hover": {
//                                     bgcolor: themeColor.color,
//                                     transform: 'scale(1.1)',
//                                   }
//                                 }}
//                               >
//                                 {index === 0 && <Check sx={{ color: 'white' }} />}
//                               </IconButton>
//                             </Tooltip>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Box>
//                   </Stack>
//                 </SettingsCard>
//               </Grid>
//             </Grid>
//           )}

//           {tabValue === 3 && (
//             <Grid container spacing={4}>
//               {/* Notification Preferences */}
//               <Grid item xs={12} lg={6}>
//                 <SettingsCard title="Notification Preferences" icon={<NotificationsActive />}>
//                   <Stack spacing={3}>
//                     {Object.entries(notifications).map(([key, value]) => (
//                       <Box key={key}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={value}
//                               // onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
//                               color="primary"
//                             />
//                           }
//                           label={
//                             <Box>
//                               <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
//                                 {key} Notifications
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Receive notifications via {key}
//                               </Typography>
//                             </Box>
//                           }
//                           sx={{ width: '100%', margin: 0 }}
//                         />
//                         <Divider sx={{ mt: 2 }} />
//                       </Box>
//                     ))}
//                   </Stack>
//                 </SettingsCard>
//               </Grid>

//               {/* Theme Preferences */}
//               <Grid item xs={12} lg={6}>
//                 <SettingsCard title="Appearance" icon={<Palette />}>
//                   <Stack spacing={3}>
//                     <Box>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={darkMode}
//                             onChange={(e) => {
//                               setDarkMode(e.target.checked);
//                               if (e.target.checked) {
//                                 setMode('dark');
//                               }
//                               else {
//                                 setMode('light');
//                               }
//                             }}
//                             color="primary"
//                           />
//                         }
//                         label={
//                           <Box display="flex" alignItems="center" gap={1}>
//                             {darkMode ? <Brightness4 /> : <Brightness7 />}
//                             <Box>
//                               <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
//                                 Dark Mode
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 Switch between light and dark themes
//                               </Typography>
//                             </Box>
//                           </Box>
//                         }
//                         sx={{ width: '100%', margin: 0 }}
//                       />
//                     </Box>

//                     <Divider />

//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
//                         Color Themes
//                       </Typography>
//                       <Grid container spacing={2}>
//                         {[
//                           { name: 'Blue', color: '#1976d2' },
//                           { name: 'Green', color: '#388e3c' },
//                           { name: 'Purple', color: '#7b1fa2' },
//                           { name: 'Orange', color: '#f57c00' },
//                         ].map((themeColor, index) => (
//                           <Grid item xs={3} key={index}>
//                             <Tooltip title={themeColor.name}>
//                               <IconButton
//                                 sx={{
//                                   width: 48,
//                                   height: 48,
//                                   bgcolor: themeColor.color,
//                                   border: index === 0 ? `3px solid ${theme.palette.primary.main}` : 'none',
//                                   "&:hover": {
//                                     bgcolor: themeColor.color,
//                                     transform: 'scale(1.1)',
//                                   }
//                                 }}
//                               >
//                                 {index === 0 && <Check sx={{ color: 'white' }} />}
//                               </IconButton>
//                             </Tooltip>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Box>
//                   </Stack>
//                 </SettingsCard>
//               </Grid>
//             </Grid>
//           )}
//         </Stack>

//         {/* Floating Action Button */}
//         <SpeedDial
//           ariaLabel="Profile Actions"
//           sx={{ position: 'fixed', bottom: 24, right: 24 }}
//           icon={<SpeedDialIcon />}
//           open={speedDialOpen}
//           onClose={() => setSpeedDialOpen(false)}
//           onOpen={() => setSpeedDialOpen(true)}
//         >
//           {speedDialActions.map((action) => (
//             <SpeedDialAction
//               key={action.name}
//               icon={action.icon}
//               tooltipTitle={action.name}
//               onClick={() => {
//                 action.action();
//                 setSpeedDialOpen(false);
//               }}
//             />
//           ))}
//         </SpeedDial>


//       </Container>
//       <EditUserModal
//         open={isUserEditing}
//         onClose={() => {
//           setIsUserEditing(false);
//         }}
//         user={user}
//         onUpdated={async () => {
//           fetchUserData();
//         }}
//       />
//     </Box>
//   );
// };

// export default AboutPage;