import * as React from 'react';
import Box from '@mui/material/Box';
import { Add, Receipt, AttachMoney, Person, Inventory } from '@mui/icons-material';
import Fade from '@mui/material/Fade';
import { Tooltip } from '@mui/material';
import ContraSideModal from '../modals/ContraSideModal';

interface ActionItem {
    icon: JSX.Element;
    label: string;
    action: string;
    layer?: number; // Optional layer specification
}

export default function RoundedButton() {
    const [open, setOpen] = React.useState(false);
    const [isContra, setIsContra] = React.useState(false);

    const actions: ActionItem[] = [
        { icon: <Receipt />, label: 'Add Invoice', action: 'contra', layer: 1 },
        { icon: <Receipt />, label: 'Add Transaction', action: 'contra', layer: 1 },
        { icon: <Receipt />, label: 'Add Customer', action: 'contra', layer: 1 },
        { icon: <Receipt />, label: 'Add Contra', action: 'contra', layer: 2 },
        { icon: <AttachMoney />, label: 'Add Journal', action: 'transaction', layer: 2 },
        { icon: <Person />, label: 'Add Quotations', action: 'customer', layer: 2 },
        { icon: <Inventory />, label: 'New Product', action: 'product', layer: 3 },
    ];

    const handleActionClick = (actionType: string) => {
        console.log(`Creating new ${actionType}`);
        if (actionType === 'contra') {
            setIsContra(true);
        }
        setOpen(false);
    };

    // Group actions by layer
    const actionsByLayer = actions.reduce((acc, action) => {
        const layer = action.layer || 1;
        if (!acc[layer]) acc[layer] = [];
        acc[layer].push(action);
        return acc;
    }, {} as Record<number, ActionItem[]>);

    // Calculate position for each button in a 90-degree arc (top to left, anti-clockwise)
    const getButtonPosition = (index: number, total: number, layer: number) => {
        const baseRadius = 80; // Base distance from the main button
        const radiusIncrement = 70; // Additional distance for each layer
        const radius = baseRadius + (layer - 1) * radiusIncrement;

        const startAngle = 90; // Start from top (90 degrees)
        const endAngle = 180; // End at left (180 degrees) - 90 degree span, anti-clockwise

        // Distribute buttons evenly across the arc
        const angleStep = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
        const angle = (startAngle + angleStep * index) * (Math.PI / 180);

        return {
            x: Math.cos(angle) * radius,
            y: -Math.sin(angle) * radius, // Negative because CSS y-axis goes down
        };
    };

    // Flatten all actions with their layer info for rendering
    const allActionsWithPositions = Object.entries(actionsByLayer).flatMap(([layerStr, layerActions]) => {
        const layer = parseInt(layerStr);
        return layerActions.map((action, index) => ({
            ...action,
            position: getButtonPosition(index, layerActions.length, layer),
            layer,
            indexInLayer: index,
        }));
    });

    return (
        <>
            {/* Overlay backdrop */}
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 1200,
                    }}
                    onClick={() => setOpen(false)}
                />
            </Fade>

            {/* Action buttons */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 'auto',
                    right: 40,
                    bottom: 40,
                    zIndex: 1200,
                }}
            >
                {allActionsWithPositions.map((item, globalIndex) => {
                    const { position, layer, indexInLayer } = item;
                    const delayMultiplier = (layer - 1) * 3 + indexInLayer;

                    return (
                        <Fade
                            key={`${item.action}-${globalIndex}`}
                            in={open}
                            timeout={400}
                            style={{
                                transitionDelay: open ? `${delayMultiplier * 50}ms` : '0ms',
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
                                }}
                            >
                                <Tooltip title={item.label} placement="left" arrow>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '48px',
                                            height: '48px',
                                            cursor: 'pointer',
                                            borderRadius: '24px',
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            boxShadow: 3,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                                transform: 'scale(1.15)',
                                                boxShadow: 6,
                                            },
                                        }}
                                        onClick={() => handleActionClick(item.action)}
                                    >
                                        {React.cloneElement(item.icon, {
                                            sx: { fontSize: '1.5rem' },
                                        })}
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Fade>
                    );
                })}
            </Box>

            {/* Main FAB button */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 'auto',
                    right: 40,
                    bottom: 40,
                    width: '56px',
                    height: '56px',
                    zIndex: 1300,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: '28px',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        boxShadow: 4,
                        transition: 'all 0.3s',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'scale(1.1)',
                            boxShadow: 6,
                        },
                    }}
                    onClick={() => setOpen(!open)}
                >
                    <Add
                        sx={{
                            fontSize: '2rem',
                            transition: 'transform 0.3s',
                            transform: open ? 'rotate(135deg)' : 'rotate(0deg)',
                        }}
                    />
                </Box>
            </Box>
            <ContraSideModal open={isContra} onClose={() => setIsContra(false)} />
        </>
    );
}