import React from "react";
import {
    Box,
    useTheme,
    alpha,
    Stack,
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
    IconButton,
    Tooltip,
    ButtonGroup,
    Badge,
} from "@mui/material";
import {
    LinkedIn as LinkedInIcon,
    Language as WebsiteIcon,
    Facebook as FacebookIcon,
    Edit as EditIcon,
    Share,
    VerifiedUser,
} from "@mui/icons-material";
import { GetCompany } from "@/utils/types";


interface ProfileHeaderProps {
    company: GetCompany | null;
    onEditToggle: () => void;
}

export const CompanyProfileHeader: React.FC<ProfileHeaderProps> = ({ company, onEditToggle }) => {
    const theme = useTheme();

    const getUserInitials = () => {
        if (!company?.name) return 'TK';
        const [first, last] = company.name.split(' ');
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
                position: 'relative',
                width: '100%',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none',
                }
            }}
        >
            <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={4}>
                        <Box position="relative">
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.palette.success.main,
                                            width: 36,
                                            height: 36,
                                            border: '3px solid white',
                                        }}
                                    >
                                        <VerifiedUser sx={{ fontSize: 20 }} />
                                    </Avatar>
                                }
                            >
                                {company?.image !== '' && typeof company?.image === 'string' ? (
                                    <img
                                        src={company.image}
                                        alt={company.name || ''}
                                        style={{
                                            width: 140,
                                            height: 140,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "4px solid rgba(255,255,255,0.3)",
                                            boxShadow: `0 12px 40px rgba(0,0,0,0.4)`,
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        alt={company?.name || ''}
                                        sx={{
                                            width: 140,
                                            height: 140,
                                            bgcolor: theme.palette.primary.dark,
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
                                )}
                            </Badge>
                        </Box>

                        <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    mb: 1,
                                    letterSpacing: -1,
                                }}
                            >
                                {company?.name}
                            </Typography>

                            <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "flex-start" }}>
                                {[
                                    { Icon: LinkedInIcon, color: '#0077B5', label: 'LinkedIn', href: 'company?.linkedin' },
                                    { Icon: FacebookIcon, color: '#1877F2', label: 'Facebook', href: 'company?.facebook' },
                                    { Icon: WebsiteIcon, color: '#4CAF50', label: 'Website', href: company?.website || '#' }
                                ].map(({ Icon, color, label, href }, index) => (
                                    <Tooltip key={index} title={label} arrow>
                                        <IconButton
                                            component="a"
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
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
                    <ButtonGroup
                        variant="contained"
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Button
                            startIcon={<Share />}
                            sx={{
                                fontWeight: 600,
                                px: 3,
                            }}
                        >
                            Share
                        </Button>
                        <Button
                            onClick={onEditToggle}
                            startIcon={<EditIcon />}
                            sx={{
                                fontWeight: 600,
                                px: 3,
                            }}
                        >
                            Edit Profile
                        </Button>
                    </ButtonGroup>
                    <IconButton
                        size="large"
                        onClick={onEditToggle}
                        sx={{
                            transition: 'all 0.2s ease',
                            display: { xs: 'flex', md: 'none' },
                            color: 'white',
                            bgcolor: alpha("hsl(0, 0%, 100%)", 0.15),
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                bgcolor: alpha("hsl(0, 0%, 100%)", 0.25),
                                transform: 'scale(1.05)',
                            }
                        }}
                    >
                        <EditIcon fontSize="medium" />
                    </IconButton>
                </Box>


            </CardContent>
        </Card>
    );
};