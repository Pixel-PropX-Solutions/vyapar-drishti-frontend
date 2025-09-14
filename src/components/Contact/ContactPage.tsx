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
    MenuItem,
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
import { ContactFormData } from '@/utils/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { sendQueryEmail } from '@/services/auth';
import toast from 'react-hot-toast';
import { formatDatewithTime } from '@/utils/functions';


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
    const dispatch = useDispatch<AppDispatch>();
    // const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState<ContactFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        employees: '',
        queryType: '',
        message: '',
        marketingConsent: true,
        time: formatDatewithTime(new Date().toISOString())
    });

    const [errors, setErrors] = useState<FormError>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    const queryTypes = [
        'General Inquiry',
        'Technical',
        'Billing',
        'Consultation',
        'Feedback',
        'Support',
        'Sales',
        'Other'
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

    const validateForm = (): boolean => {
        const newErrors: FormError = {};

        // Required fields
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';

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

        // Industry is required
        if (!formData.industry) newErrors.industry = 'Please select your industry';

        // Query type is required
        if (!formData.queryType) newErrors.queryType = 'Please select a query type';

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
            await dispatch(sendQueryEmail(formData)).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success('Thank you for contacting us! We will get back to you shortly.');
                } else {
                    toast.error('Something went wrong. Please try again later.');
                }
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    queryType: '',
                    company: '',
                    industry: '',
                    employees: '',
                    message: '',
                    marketingConsent: true,
                    time: formatDatewithTime(new Date().toISOString())
                });
            });


        } catch (error) {
            console.log("Error", error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
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
                            p: 2,
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
                        Have questions about our inventory management solution? Our team is here to help you streamline your operations.
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
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Company Name"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            error={!!errors.company}
                                            helperText={errors.company}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            error={!!errors.industry}
                                            helperText={errors.industry}
                                            required
                                            select
                                            variant="outlined"
                                        >
                                            {industries.map((industry) => (
                                                <MenuItem key={industry} value={industry}>
                                                    {industry}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Company Size"
                                            name="employees"
                                            value={formData.employees}
                                            onChange={handleInputChange}
                                            error={!!errors.employees}
                                            helperText={errors.employees}
                                            select
                                            variant="outlined"
                                        >
                                            {employeeRanges.map((range) => (
                                                <MenuItem key={range} value={range}>
                                                    {range}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Query Type"
                                            name="queryType"
                                            value={formData.queryType}
                                            onChange={handleInputChange}
                                            error={!!errors.queryType}
                                            helperText={errors.queryType}
                                            required
                                            select
                                            variant="outlined"
                                        >
                                            {queryTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress />
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
                                link="mailto:vyapardrishti@gmail.com"
                            />

                            <ContactInfoCard
                                icon={<Phone />}
                                title="Call Us"
                                content="+91 63670 97548"
                                link="tel:+916367097548"
                            />

                            <ContactInfoCard
                                icon={<LocationOn />}
                                title="Our Office"
                                content="Udaipur, Rajasthan, India"
                            />

                            <ContactInfoCard
                                icon={<Support />}
                                title="Technical Support"
                                content="help@vyapardrishti.in"
                                link="mailto:vyapardrishti@gmail.com"
                            />

                            <ContactInfoCard
                                icon={<BusinessCenter />}
                                title="Sales Inquiries"
                                content="sales@vyapardrishti.in"
                                link="mailto:vyapardrishti@gmail.com"
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
            </Container>
        </Box>
    );
};

export default ContactPage;