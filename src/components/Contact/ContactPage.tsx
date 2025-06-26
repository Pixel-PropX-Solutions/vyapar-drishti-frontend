import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Snackbar,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import {
    Email,
    Phone,
    LocationOn,
    BusinessCenter,
    Support,
    AccessTime,
    ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Types definitions
interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    industry: string;
    employees: string;
    message: string;
    marketingConsent: boolean;
}

interface FormError {
    [key: string]: string;
}

// Helper components
const ContactInfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    content: string;
    link?: string;
}> = ({ icon, title, content, link }) => {
    return (
        <Card
            elevation={0}
            sx={{
                p: 1,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            mr: 2
                        }}
                    >
                        {icon}
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            {title}
                        </Typography>
                        {link ? (
                            <Typography
                                component="a"
                                href={link}
                                variant="body1"
                                sx={{
                                    fontWeight: 500,
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {content}
                            </Typography>
                        ) : (
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {content}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const OfficeHoursCard: React.FC = () => {
    return (
        <Card
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mt: 4
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Business Hours
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Monday - Friday:
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            9:00 AM - 6:00 PM IST
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Saturday:
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            10:00 AM - 2:00 PM IST
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Sunday:
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Closed
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// Main Contact Page Component
const ContactPage: React.FC = () => {
    // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState<ContactFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        employees: '',
        message: '',
        marketingConsent: true
    });

    const [errors, setErrors] = useState<FormError>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const industries = [
        'Healthcare',
        'Finance',
        'Education',
        'Manufacturing',
        'Retail',
        'Technology',
        'Hospitality',
        'Transportation',
        'Government',
        'Other'
    ];

    const employeeRanges = [
        '1-5 employees',
        '6-10 employees',
        '11-25 employees',
        '26-50 employees',
        '51-100 employees',
        '100+ employees'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user makes a selection
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormError = {};

        // Required fields
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (optional but must be valid if provided)
        if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Company is required
        if (!formData.company.trim()) newErrors.company = 'Company name is required';

        // Industry is required
        if (!formData.industry) newErrors.industry = 'Please select your industry';

        // Employees selection is required
        if (!formData.employees) newErrors.employees = 'Please select company size';

        // Message should be at least 10 characters
        if (!formData.message.trim()) {
            newErrors.message = 'Please enter your message';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message should be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success handling
            setSnackbar({
                open: true,
                message: 'Thank you for contacting us! We will get back to you shortly.',
                severity: 'success'
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                company: '',
                industry: '',
                employees: '',
                message: '',
                marketingConsent: true
            });
        } catch (error) {
            // Error handling
            setSnackbar({
                open: true,
                message: 'Something went wrong. Please try again later.',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Box
            sx={{
                py: { xs: 6, md: 10 },
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background decoration elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(54, 126, 56, 0.3) 0%, rgba(46, 125, 50, 0) 70%)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 100,
                    left: 100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(54, 126, 56, 0.3) 0%, rgba(46, 125, 50, 0) 70%)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 100,
                    right: 100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(54, 126, 56, 0.3) 0%, rgba(46, 125, 50, 0) 70%)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(54, 126, 56, 0.3) 0%, rgba(46, 125, 50, 0) 70%)',
                    zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{ textAlign: 'center', mb: 6 }}
                >
                    <Chip
                        label="CONTACT US"
                        color="primary"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 28,
                            mb: 2,
                            '& .MuiChip-label': {
                                px: 2
                            }
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                    >
                        Get in Touch
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        color="text.secondary"
                        sx={{
                            maxWidth: 700,
                            mx: 'auto',
                            mb: 4,
                            fontWeight: 400
                        }}
                    >
                        Have questions about our pharmacy inventory management solution? Our team is here to help you streamline your operations.
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={1}
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Contact Form Section */}
                    <Grid
                        item
                        xs={12}
                        md={7.5}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, md: 3 },
                                borderRadius: 1,
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 600, mb: 3 }}
                            >
                                Tell us about your needs
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            error={!!errors.firstName}
                                            helperText={errors.firstName}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            placeholder="Optional"
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Company / Pharmacy Name"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            error={!!errors.company}
                                            helperText={errors.company}
                                            required
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={!!errors.industry} required>
                                            <InputLabel id="industry-label">Industry</InputLabel>
                                            <Select
                                                labelId="industry-label"
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleSelectChange}
                                                label="Industry"
                                            >
                                                {industries.map((industry) => (
                                                    <MenuItem key={industry} value={industry}>
                                                        {industry}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.industry && (
                                                <Typography variant="caption" color="error">
                                                    {errors.industry}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth error={!!errors.employees} required>
                                            <InputLabel id="employees-label">Company Size</InputLabel>
                                            <Select
                                                labelId="employees-label"
                                                name="employees"
                                                value={formData.employees}
                                                onChange={handleSelectChange}
                                                label="Company Size"
                                            >
                                                {employeeRanges.map((range) => (
                                                    <MenuItem key={range} value={range}>
                                                        {range}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.employees && (
                                                <Typography variant="caption" color="error">
                                                    {errors.employees}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="How can we help you?"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            error={!!errors.message}
                                            helperText={errors.message}
                                            multiline
                                            rows={4}
                                            required
                                            variant="outlined"
                                            placeholder="Tell us about your specific needs or questions..."
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            fullWidth
                                            disabled={isSubmitting}
                                            sx={{
                                                py: 1.5,
                                                mt: 2,
                                                fontWeight: 600,
                                                position: 'relative'
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress
                                                    size={24}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        marginTop: '-12px',
                                                        marginLeft: '-12px'
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    Submit Request <ArrowForward sx={{ ml: 1 }} />
                                                </>
                                            )}
                                        </Button>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                                        >
                                            We'll get back to you within 24 business hours
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>

                    {/* Contact Information Section */}
                    <Grid
                        item
                        xs={12}
                        md={4.5}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 1,
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                sx={{ fontWeight: 600, mb: 3 }}
                            >
                                Contact Information
                            </Typography>

                            <ContactInfoCard
                                icon={<Email />}
                                title="Email Us"
                                content="support@vyapardrishti.in"
                                link="mailto:tohidkhan1193407@gmail.com"
                            />

                            <ContactInfoCard
                                icon={<Phone />}
                                title="Call Us"
                                content="+91 (636) 7097-548"
                                link="tel:+916367097548"
                            />

                            <ContactInfoCard
                                icon={<LocationOn />}
                                title="Our Office"
                                content="123 Innovation Drive, Boston, MA 02210"
                            />

                            <ContactInfoCard
                                icon={<Support />}
                                title="Technical Support"
                                content="help@vyapardrishti.in"
                                link="mailto:tohidkhan1193407@gmail.com"
                            />

                            <ContactInfoCard
                                icon={<BusinessCenter />}
                                title="Sales Inquiries"
                                content="sales@vyapardrishti.in"
                                link="mailto:tohidkhan1193407@gmail.com"
                            />

                            <OfficeHoursCard />
                        </Paper>
                    </Grid>
                </Grid>

                {/* FAQ Section */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    sx={{ mt: 8 }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            textAlign: 'center',
                            mb: 4
                        }}
                    >
                        Frequently Asked Questions
                    </Typography>

                    <Grid container spacing={3}>
                        {[
                            {
                                question: "How quickly can we implement your system?",
                                answer: "Most pharmacies are fully operational within 2-3 weeks. Our implementation team works closely with you to ensure a smooth transition with minimal disruption to your daily operations."
                            },
                            {
                                question: "Do you offer integration with existing pharmacy systems?",
                                answer: "Yes, our solution integrates with most major pharmacy management systems, including RxWorks, PharmaSys, and MedicalTrack. We'll provide a full compatibility assessment during your consultation."
                            },
                            {
                                question: "Is your platform HIPAA compliant?",
                                answer: "Absolutely. Our entire system is built with HIPAA compliance as a foundational requirement. We maintain strict data security protocols and regular compliance audits."
                            },
                            {
                                question: "What kind of support do you provide?",
                                answer: "We offer 24/7 technical support via email and phone during business hours. All clients are assigned a dedicated account manager for ongoing assistance and training."
                            }
                        ].map((faq, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        gutterBottom
                                        sx={{ fontWeight: 600, color: 'primary.main' }}
                                    >
                                        {faq.question}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {faq.answer}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Snackbar for form submission feedback */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default ContactPage;