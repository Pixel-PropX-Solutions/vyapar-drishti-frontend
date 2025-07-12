import { Clear, Info } from "@mui/icons-material";
import { Card, CardContent, Box, Typography, Chip, IconButton, Fade } from "@mui/material";

export const SectionCard = ({
    title,
    icon,
    section,
    toggleSection,
    expandedSections,
    required = false,
    children
}: {
    title: string;
    icon: React.ReactNode;
    section: "profile" | "contact" | "address" | "bank";
    toggleSection: (section: "profile" | "contact" | "address" | "bank") => void;
    expandedSections: Record<string, boolean>;
    required?: boolean;
    children: React.ReactNode;
}) => (
    <Card
        elevation={0}
        sx={{
            mb: 1,
            width: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transform: 'translateY(-2px)'
            }
        }}
    >
        <CardContent
            sx={{
                p: 0,
                '&:last-child': { p: 0 }
            }}
        >
            <Box
                onClick={() => toggleSection(section)}
                sx={{
                    px: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    backgroundColor: expandedSections[section] ? '#f8f9fa' : 'transparent',
                    borderBottom: expandedSections[section] ? '1px solid #e0e0e0' : 'none',
                    transition: 'background-color 0.2s ease'
                }}
            >
                {icon}
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    {title}
                </Typography>
                {required && (
                    <Chip
                        label="Required"
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ mr: 1 }}
                    />
                )}
                <IconButton size="small">
                    {expandedSections[section] ? <Clear /> : <Info />}
                </IconButton>
            </Box>
            <Fade in={expandedSections[section]} timeout={300}>
                <Box sx={{ p: expandedSections[section] ? 1 : 0, pt: 0 }}>
                    {expandedSections[section] && children}
                </Box>
            </Fade>
            {!expandedSections[section] && (
                <Box sx={{ p: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                    Click to expand and edit {title.toLowerCase()} section.
                </Box>
            )}
        </CardContent>
    </Card>
);