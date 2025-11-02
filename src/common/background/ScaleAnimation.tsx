import { ReactNode, useEffect, useState, CSSProperties } from 'react';


interface ScaleAnimationViewProps {
    children: ReactNode;
    duration?: number;
    delay?: number;
    useRandomDelay?: boolean;
    style?: CSSProperties;
}

export default function ScaleAnimationView({
    children,
    duration = 500,
    delay = 0,
    useRandomDelay = false,
    style,
}: ScaleAnimationViewProps) {
    const [isVisible, setIsVisible] = useState(false);
    const actualDelay = useRandomDelay
        ? Math.floor(Math.random() * duration * 0.5)
        : delay;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, actualDelay);

        return () => clearTimeout(timer);
    }, [actualDelay]);

    return (
        <div
            style={{
                position: 'relative',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                transition: `all ${duration}ms ease-out`,
                ...style,
            }}
        >
            {children}
        </div>
    );
}
