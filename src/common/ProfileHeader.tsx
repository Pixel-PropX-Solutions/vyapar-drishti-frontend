import React from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  Tooltip,
  alpha,
  Chip,
  Stack,
  ButtonGroup,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  Facebook as FacebookIcon,
  Edit as EditIcon,
  Business,
  Star,
} from "@mui/icons-material";
import { GetCompany, GetUser } from "@/utils/types";

// Enhanced Profile Header with floating action button
export const ProfileHeader: React.FC<{
  user: GetUser | null;
  company: GetCompany | null;
  tabValue: number;
  onEditToggle: () => void;
}> = ({ user, onEditToggle, tabValue, company }) => {
  const theme = useTheme();

  const getUserInitials = () => {
    if (!user?.name) return 'TK';
    const { first, last } = user.name;
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  };

  const getCompanyInitials = () => {
    if (!company?.company_name) return 'TK';
    const companyName = company.company_name.split(" ");
    const first = companyName[0];
    const last = companyName[companyName.length - 1];
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  };


  return (
    <Card
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1, mb: 1 }}>
              {tabValue !== 1 ? "My Profile" : "Company Profile"}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 400 }}>
              {tabValue !== 1 ? "Manage your account settings and details" : "View and edit your company details"}
            </Typography>
          </Box>
          <ButtonGroup
            variant="contained"
            sx={{
              bgcolor: alpha("hsl(0, 0%, 100%)", 0.15),
              border: `1px solid ${alpha("hsl(0, 0%, 100%)", 0.2)}`,
            }}
          >
            <Button
              onClick={onEditToggle}
              startIcon={<EditIcon />}
              sx={{
                fontWeight: 600,
                px: 3,
              }}
            >
              {tabValue !== 1 ? "Edit Profile" : ' Edit Company'}
            </Button>
          </ButtonGroup>
        </Box>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={6}>
          <Box position="relative">
            {tabValue !== 1 ? (<>
              {(user?.image !== '' && typeof user?.image === 'string') ? (
                <img
                  src={typeof user?.image === 'string' ? user?.image : ''}
                  alt={user?.name?.first}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />) : (
                <Avatar
                  alt={`${user?.name?.first} ${user?.name?.last}`}
                  sx={{
                    width: 140,
                    height: 140,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    fontSize: "3rem",
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
                    }
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              )}</>) : (
              <>
                {(company?.image !== '' && typeof company?.image === 'string') ? (
                  <img
                    src={typeof company?.image === 'string' ? company?.image : ''}
                    alt={company?.company_name}
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  />) : (
                  <Avatar
                    alt={company?.company_name}
                    sx={{
                      width: 140,
                      height: 140,
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontSize: "3rem",
                      border: "4px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
                      }
                    }}
                  >
                    {getCompanyInitials()}
                  </Avatar>
                )}</>
            )}
          </Box>

          <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
            {tabValue !== 1 ?
              (<Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: -1,
                }}
              >
                {user?.name?.first} {user?.name?.last}
              </Typography>) :
              (<Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  letterSpacing: -1,
                }}
              >
                {company?.company_name ?? "Default Company"}
              </Typography>)}

            <Stack direction="row" spacing={1}
              justifyContent={{ xs: "center", md: "flex-start" }}
              alignItems={{ xs: 'flex-start', md: 'center' }} mb={3}>
              {tabValue !== 1 ?
                (<Chip
                  label={user?.user_type === 'admin' ? "Admin" : user?.user_type === 'user' ? "User" : "Guest"}
                  icon={<Business fontSize="small" />}
                  sx={{
                    bgcolor: alpha("hsl(0, 0%, 100%)", 0.2),
                    color: "white",
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    height: 36,
                    border: `2px solid ${alpha("hsl(0, 0%, 100%)", 0.3)}`,
                    backdropFilter: 'blur(10px)',
                  }}
                />) : (
                  <Chip
                    label={company?.brand_name || "Brand"}
                    size="medium"
                    icon={<Business fontSize="small" />}
                    sx={{
                      bgcolor: alpha("hsl(0, 0%, 100%)", 0.2),
                      color: "white",
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      height: 36,
                      border: `2px solid ${alpha("hsl(0, 0%, 100%)", 0.3)}`,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                )}
              <Chip
                label="Premium"
                icon={<Star fontSize="small" />}
                sx={{
                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                  color: theme.palette.warning.main,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  height: 36,
                  border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }}>
              {[
                { Icon: LinkedInIcon, color: '#0077B5', label: 'LinkedIn' },
                { Icon: FacebookIcon, color: '#1877F2', label: 'Facebook' },
                { Icon: WebsiteIcon, color: '#4CAF50', label: 'Website' }
              ].map(({ Icon, color, label }, index) => (
                <Tooltip key={index} title={label} arrow>
                  <IconButton
                    sx={{
                      bgcolor: alpha("hsl(0, 0%, 100%)", 0.15),
                      color: "white",
                      width: 48,
                      height: 48,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha("hsl(0, 0%, 100%)", 0.2)}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: alpha(color, 0.2),
                        transform: "translateY(-2px) scale(1.05)",
                        boxShadow: `0 8px 20px ${alpha(color, 0.3)}`,
                      },
                    }}
                  >
                    <Icon />
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
