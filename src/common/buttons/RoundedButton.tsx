import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Add,
    // Receipt,
    AttachMoney,
    // Person,
    Inventory,
    Description,
    // ShoppingCart,
    // Business,
    // Create
} from '@mui/icons-material';
import Fade from '@mui/material/Fade';
import { Tooltip, Typography } from '@mui/material';
import ContraSideModal from '../modals/ContraSideModal';
import JournalSideModal from '../modals/JournalSideModal';
import ProductsSideModal from '@/features/products/ProductsSideModal';

interface ActionItem {
    icon: JSX.Element;
    label: string;
    action: string;
    color?: string;
    category?: string;
}

export default function EnhancedFABMenu() {
    const [open, setOpen] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [isContraModalOpen, setIsContraModalOpen] = React.useState(false);
    const [isJournalModalOpen, setIsJournalModalOpen] = React.useState(false);
    const [isProductsModalOpen, setIsProductsModalOpen] = React.useState(false);

    const actions: ActionItem[] = [
        { icon: <Description />, label: 'Contra', action: 'contra', color: '#9c27b0', category: 'Finance' },
        { icon: <AttachMoney />, label: 'Journal', action: 'journal', color: '#d32f2f', category: 'Finance' },
        { icon: <Inventory />, label: 'Product', action: 'product', color: '#f57c00', category: 'Inventory' },
        // { icon: <AttachMoney />, label: 'Transaction', action: 'transaction', color: '#2e7d32', category: 'Finance' },
        // { icon: <Person />, label: 'Customer', action: 'customer', color: '#ed6c02', category: 'Contact' },
        // { icon: <Receipt />, label: 'Invoice', action: 'invoice', color: '#1976d2', category: 'Sales' },
        // { icon: <Add />, label: 'Ledger', action: 'ledger', color: '#ed6c02', category: 'Ledger' },
        // { icon: <ShoppingCart />, label: 'Quotation', action: 'quotations', color: '#0288d1', category: 'Sales' },
    ];

    const handleActionClick = (actionType: string) => {
        console.log(`Creating new ${actionType}`);
        if (actionType === 'contra') {
            setIsContraModalOpen(true);
        } else if (actionType === 'journal') {
            setIsJournalModalOpen(true);
        } else if (actionType === 'product') {
            setIsProductsModalOpen(true);
        }
        setOpen(false);
    };

    // Modified arc calculation to match the image style - tighter arc closer to main button
    const getButtonPosition = (index: number, total: number) => {
        const radius = 80; // Smaller radius for tighter arc
        const startAngle = 180; // Start from 270 degrees (more to the right)
        const endAngle = 90; // End at 360 degrees (wider spread)
        const totalSpan = endAngle - startAngle;

        // Distribute evenly across the arc
        const angleStep = total > 1 ? totalSpan / (total - 1) : 0;
        const angle = (startAngle + angleStep * index) * (Math.PI / 180);

        return {
            x: Math.cos(angle) * radius,
            y: -Math.sin(angle) * radius,
        };
    };

    const getButtonPosition2 = (index: number, total: number) => {
        const radius = 140; // Smaller radius for tighter arc
        const startAngle = 5; // Start from 45 degrees (more to the right)
        const endAngle = 110; // End at 180 degrees (wider spread)
        const totalSpan = endAngle - startAngle;

        // Distribute evenly across the arc
        const angleStep = total > 1 ? totalSpan / (total - 1) : 0;
        const angle = (startAngle + angleStep * index) * (Math.PI / 180);

        return {
            x: Math.cos(angle) * radius,
            y: -Math.sin(angle) * radius,
        };
    };

    return (
        <>
            {/* Enhanced backdrop */}
            <Fade in={open} timeout={300}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1100,
                        transition: 'all 0.3s ease',
                    }}
                    onClick={() => setOpen(false)}
                />
            </Fade>

            {/* Action buttons with modified arc positioning */}
            <Box
                sx={{
                    position: 'fixed',
                    right: 40,
                    bottom: 40,
                    zIndex: 1150,
                }}
            >
                {actions.map((item, index) => {
                    const position = index < 3 ? getButtonPosition(index, 3) : getButtonPosition2(index, actions.length - 3);
                    const isHovered = hoveredIndex === index;
                    const delay = index * 50;

                    return (
                        <Fade
                            key={item.action}
                            in={open}
                            timeout={400}
                            style={{
                                transitionDelay: open ? `${delay}ms` : '0ms',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: open ? `${-position.x}px` : '8px',
                                    bottom: open ? `${-position.y}px` : '8px',
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    opacity: open ? 1 : 0,
                                    pointerEvents: open ? 'auto' : 'none',
                                    transform: open
                                        ? isHovered ? 'scale(1.15)' : 'scale(1)'
                                        : 'scale(0)',
                                    zIndex: isHovered ? 1300 : 1250,
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Tooltip
                                    title={
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    }
                                    placement="left"
                                    arrow
                                    open={isHovered}
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                bgcolor: 'rgba(0, 0, 0, 0.92)',
                                                fontSize: '0.875rem',
                                                px: 2,
                                                py: 1.5,
                                                borderRadius: 2,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                            }
                                        },
                                        arrow: {
                                            sx: {
                                                color: 'rgba(0, 0, 0, 0.92)',
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '52px',
                                            height: '52px',
                                            cursor: 'pointer',
                                            borderRadius: '50%',
                                            bgcolor: item.color || 'primary.main',
                                            color: 'white',
                                            boxShadow: isHovered
                                                ? `0 8px 24px ${item.color}40, 0 4px 8px ${item.color}30`
                                                : `0 4px 12px ${item.color}30`,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: isHovered ? '2px solid white' : '2px solid rgba(255,255,255,0.3)',
                                            '&:active': {
                                                transform: 'scale(0.9)',
                                                boxShadow: `0 2px 8px ${item.color}40`,
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: -4,
                                                borderRadius: '50%',
                                                background: `radial-gradient(circle, ${item.color}40 0%, transparent 70%)`,
                                                opacity: isHovered ? 1 : 0,
                                                transition: 'opacity 0.3s',
                                                animation: isHovered ? 'ripple 1.5s infinite' : 'none',
                                            },
                                            '@keyframes ripple': {
                                                '0%': {
                                                    transform: 'scale(1)',
                                                    opacity: 0.6,
                                                },
                                                '100%': {
                                                    transform: 'scale(1.5)',
                                                    opacity: 0,
                                                },
                                            },
                                        }}
                                        onClick={() => handleActionClick(item.action)}
                                    >
                                        {React.cloneElement(item.icon, {
                                            sx: {
                                                fontSize: isHovered ? '1.6rem' : '1.4rem',
                                                transition: 'all 0.3s',
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                            },
                                        })}
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Fade>
                    );
                })}

                {/* Connection lines - adjusted for tighter arc */}
                {open && (
                    <svg
                        style={{
                            position: 'fixed',
                            right: 40,
                            bottom: 40,
                            width: '150px',
                            height: '150px',
                            pointerEvents: 'none',
                            opacity: 0.15,
                        }}
                    >
                        {actions.map((_, index) => {
                            const position = index < 3 ? getButtonPosition(index, 3) : getButtonPosition2(index, actions.length - 3);
                            return (
                                <line
                                    key={index}
                                    x1={120 + position.x}
                                    y1={120 + position.y}
                                    x2={120}
                                    y2={120}
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    style={{
                                        animation: 'dash 20s linear infinite',
                                    }}
                                />
                            );
                        })}
                    </svg>
                )}
            </Box>

            {/* Main FAB button - slightly smaller to match the style */}
            <Box
                sx={{
                    position: 'fixed',
                    right: 40,
                    bottom: 40,
                    width: '64px',
                    height: '64px',
                    zIndex: 1200,
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        bgcolor: open ? '#1565c0' : 'primary.main',
                        color: 'white',
                        boxShadow: open
                            ? '0 12px 40px rgba(25, 118, 210, 0.5), 0 0 0 4px rgba(25, 118, 210, 0.2)'
                            : '0 6px 20px rgba(25, 118, 210, 0.4)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: open ? 'scale(1.05) rotate(0deg)' : 'scale(1) rotate(0deg)',
                        border: '2px solid white',
                        '&:hover': {
                            bgcolor: '#1565c0',
                            transform: 'scale(1.1) rotate(90deg)',
                            boxShadow: '0 12px 40px rgba(25, 118, 210, 0.6), 0 0 0 6px rgba(25, 118, 210, 0.15)',
                        },
                        '&:active': {
                            transform: open ? 'scale(1)' : 'scale(0.95)',
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.4) 0%, transparent 70%)',
                            opacity: open ? 1 : 0,
                            animation: open ? 'pulse 2s ease-in-out infinite' : 'none',
                            transition: 'opacity 0.3s',
                        },
                        '@keyframes pulse': {
                            '0%, 100%': {
                                transform: 'scale(1)',
                                opacity: 0.6,
                            },
                            '50%': {
                                transform: 'scale(1.3)',
                                opacity: 0.2,
                            },
                        },
                    }}
                    onClick={() => setOpen(!open)}
                >
                    <Add
                        sx={{
                            fontSize: '2.2rem',
                            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: open ? 'rotate(135deg)' : 'rotate(0deg)',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        }}
                    />
                </Box>
            </Box>

            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
            `}</style>

            <ContraSideModal open={isContraModalOpen} onClose={() => setIsContraModalOpen(false)} contraId={null} />
            <JournalSideModal open={isJournalModalOpen} onClose={() => setIsJournalModalOpen(false)} />
            <ProductsSideModal drawer={isProductsModalOpen} setDrawer={setIsProductsModalOpen} product={null} />

        </>
    );
}