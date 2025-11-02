
import { alpha, useTheme } from '@mui/material';
import { ReactNode, useEffect, useRef, useState, CSSProperties } from 'react';

type Vector = { x: number; y: number };

type Circle = {
    pos: Vector;
    vel: Vector;
    size: number;
};

const createCircle = (x: number, y: number, size: number): Circle => ({
    pos: { x, y },
    vel: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
    size: size,
});

const softColorsLight = [
    // Original colors
    'rgb(255, 182, 193)', // Light Pink
    'rgb(135, 206, 250)', // Light Sky Blue
    'rgb(144, 238, 144)', // Light Green
    'rgb(221, 160, 221)', // Plum
    'rgb(173, 216, 230)', // Light Blue
    'rgb(255, 228, 225)', // Misty Rose
    'rgb(240, 230, 140)', // Khaki
    'rgb(250, 250, 210)', // Light Goldenrod Yellow
    'rgb(176, 224, 230)', // Powder Blue
    'rgb(255, 255, 224)', // Light Yellow
    'rgb(255, 218, 185)', // Peach Puff
    'rgb(255, 240, 245)', // Lavender Blush
    'rgb(230, 230, 250)', // Lavender
    'rgb(216, 191, 216)', // Thistle
    'rgb(255, 239, 213)', // Papaya Whip
    'rgb(255, 245, 238)', // Seashell
    'rgb(245, 245, 220)', // Beige
    'rgb(255, 250, 205)', // Lemon Chiffon
    'rgb(175, 238, 238)', // Pale Turquoise
    'rgb(224, 255, 255)', // Light Cyan
    'rgb(245, 255, 250)', // Mint Cream
    'rgb(255, 228, 196)', // Bisque
    'rgb(255, 235, 205)', // Blanched Almond
    'rgb(250, 235, 215)', // Antique White
    'rgb(253, 245, 230)', // Old Lace
    'rgb(255, 248, 220)', // Cornsilk
    'rgb(255, 255, 240)', // Ivory
    'rgb(240, 248, 255)', // Alice Blue
    'rgb(248, 248, 255)', // Ghost White
    'rgb(245, 245, 245)', // White Smoke
    'rgb(255, 250, 250)', // Snow
    'rgb(255, 192, 203)', // Pink
    'rgb(255, 160, 122)', // Light Salmon
    'rgb(255, 182, 193)', // Light Pink
    'rgb(219, 112, 147)', // Pale Violet Red
    'rgb(176, 196, 222)', // Light Steel Blue
    'rgb(173, 216, 230)', // Light Blue
    'rgb(135, 206, 235)', // Sky Blue
    'rgb(152, 251, 152)', // Pale Green
    'rgb(144, 238, 144)', // Light Green
    'rgb(193, 255, 193)', // Mint Green
    'rgb(221, 160, 221)', // Plum
    'rgb(238, 130, 238)', // Violet
    'rgb(218, 112, 214)', // Orchid
    'rgb(255, 222, 173)', // Navajo White
    'rgb(250, 240, 230)', // Linen
    'rgb(255, 228, 181)', // Moccasin
    'rgb(255, 218, 185)', // Peach
    'rgb(244, 164, 96)',  // Sandy Brown
];

const softColorsDark = [
    // Original colors - darker variants
    'rgb(102, 73, 77)',   // Dark Pink
    'rgb(54, 82, 100)',   // Dark Sky Blue
    'rgb(58, 95, 58)',    // Dark Green
    'rgb(88, 64, 88)',    // Dark Plum
    'rgb(69, 86, 92)',    // Dark Blue
    'rgb(102, 91, 90)',   // Dark Misty Rose
    'rgb(96, 92, 56)',    // Dark Khaki
    'rgb(100, 100, 84)',  // Dark Goldenrod
    'rgb(70, 90, 92)',    // Dark Powder Blue
    'rgb(102, 102, 90)',  // Dark Yellow
    'rgb(102, 87, 74)',   // Dark Peach
    'rgb(102, 96, 98)',   // Dark Lavender Blush
    'rgb(92, 92, 100)',   // Dark Lavender
    'rgb(86, 76, 86)',    // Dark Thistle
    'rgb(102, 96, 85)',   // Dark Papaya
    'rgb(102, 98, 95)',   // Dark Seashell
    'rgb(98, 98, 88)',    // Dark Beige
    'rgb(102, 100, 82)',  // Dark Lemon
    'rgb(70, 95, 95)',    // Dark Turquoise
    'rgb(90, 102, 102)',  // Dark Cyan
    'rgb(96, 102, 96)',   // Dark Honeydew
    'rgb(98, 102, 100)',  // Dark Mint Cream
    'rgb(102, 91, 78)',   // Dark Bisque
    'rgb(102, 94, 82)',   // Dark Almond
    'rgb(100, 94, 86)',   // Dark Antique White
    'rgb(101, 98, 92)',   // Dark Old Lace
    'rgb(102, 99, 88)',   // Dark Cornsilk
    'rgb(102, 102, 96)',  // Dark Ivory
    'rgb(96, 99, 102)',   // Dark Alice Blue
    'rgb(99, 99, 102)',   // Dark Ghost White
    'rgb(98, 98, 98)',    // Dark White Smoke
    'rgb(102, 100, 100)', // Dark Snow
    'rgb(102, 77, 81)',   // Dark Pink
    'rgb(102, 64, 49)',   // Dark Salmon
    'rgb(102, 73, 77)',   // Dark Light Pink
    'rgb(88, 45, 59)',    // Dark Violet Red
    'rgb(70, 78, 89)',    // Dark Steel Blue
    'rgb(69, 86, 92)',    // Dark Light Blue
    'rgb(54, 82, 94)',    // Dark Sky Blue
    'rgb(61, 100, 61)',   // Dark Pale Green
    'rgb(58, 95, 58)',    // Dark Light Green
    'rgb(77, 102, 77)',   // Dark Mint Green
    'rgb(88, 64, 88)',    // Dark Plum
    'rgb(95, 52, 95)',    // Dark Violet
    'rgb(87, 45, 86)',    // Dark Orchid
    'rgb(102, 89, 69)',   // Dark Navajo White
    'rgb(100, 96, 92)',   // Dark Linen
    'rgb(102, 91, 72)',   // Dark Moccasin
    'rgb(102, 87, 74)',   // Dark Peach
    'rgb(98, 66, 38)',    // Dark Sandy Brown
];

interface ParticleBackgroundProps {
    style?: CSSProperties;
    children?: ReactNode[];
    maxSize?: number;
}

export default function ParticleBackground({
    style,
    children,
    maxSize = 110
}: ParticleBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const theme = useTheme();
    const softColors = theme.palette.mode === 'dark' ? softColorsDark : softColorsLight;

    const circleSize = useRef(
        Array.from(
            { length: children?.length ?? 10 },
            () => Math.floor(Math.random() * 20 + maxSize - 50)
        )
    ).current;

    const [circles, setCircles] = useState<Circle[]>([]);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        setCircles(
            circleSize.map((size) =>
                createCircle(
                    Math.floor(Math.random() * (dimensions.width - size)),
                    Math.floor(Math.random() * (dimensions.height - size)),
                    size
                )
            )
        );
    }, [dimensions, circleSize]);

    useEffect(() => {
        if (circles.length === 0 || dimensions.width === 0) return;

        const updateCircles = () => {
            setCircles((prevCircles) =>
                prevCircles.map((circle, index) => {
                    const newCircle = { ...circle };
                    newCircle.pos.x += newCircle.vel.x;
                    newCircle.pos.y += newCircle.vel.y;

                    if (
                        newCircle.pos.x < 0 ||
                        dimensions.width - circleSize[index] < newCircle.pos.x
                    ) {
                        newCircle.vel.x *= -1;
                        newCircle.pos.x =
                            newCircle.pos.x < 0 ? 0 : dimensions.width - circleSize[index];
                    }

                    if (
                        newCircle.pos.y < 0 ||
                        dimensions.height - circleSize[index] < newCircle.pos.y
                    ) {
                        newCircle.vel.y *= -1;
                        newCircle.pos.y =
                            newCircle.pos.y < 0 ? 0 : dimensions.height - circleSize[index];
                    }

                    return newCircle;
                })
            );
        };

        const animate = () => {
            updateCircles();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [circles.length, dimensions, circleSize]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                ...style,
            }}
        >
            {circles.map((circle, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        width: circleSize[index],
                        height: circleSize[index],
                        borderRadius: '50%',
                        backgroundColor: alpha( softColors[index], 0.6),
                        border: `2px solid ${alpha(softColors[index], 0.9)}`,
                        top: circle.pos.y,
                        left: circle.pos.x,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {children?.[index] ?? null}
                </div>
            ))}
        </div>
    );
}
