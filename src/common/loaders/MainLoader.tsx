// import React from 'react';
// import {
//     Box,
//     Typography,
//     Container,
//     styled,
//     keyframes
// } from '@mui/material';

// // Keyframe animations
// const slideInLeft = keyframes`
//   from {
//     transform: translateX(-100px);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// `;

// const slideInRight = keyframes`
//   from {
//     transform: translateX(100px);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// `;

// const eyeAppear = keyframes`
//   from {
//     transform: scale(0);
//     opacity: 0;
//   }
//   60% {
//     transform: scale(1.1);
//   }
//   to {
//     transform: scale(1);
//     opacity: 1;
//   }
// `;

// const pulseIris = keyframes`
//   0%, 100% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.05);
//   }
// `;

// const rotatePupil = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;

// const shimmer = keyframes`
//   0%, 100% {
//     opacity: 0.8;
//   }
//   50% {
//     opacity: 1;
//     filter: brightness(1.3);
//   }
// `;

// const growArrow = keyframes`
//   from {
//     transform: scale(0);
//     opacity: 0;
//   }
//   to {
//     transform: scale(1);
//     opacity: 1;
//   }
// `;

// const fadeInText = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const dotPulse = keyframes`
//   0%, 80%, 100% {
//     opacity: 0;
//   }
//   40% {
//     opacity: 1;
//   }
// `;

// const float = keyframes`
//   0%, 100% {
//     transform: translateY(0px);
//   }
//   50% {
//     transform: translateY(-10px);
//   }
// `;

// // Styled components
// const LoaderContainer = styled(Container)(() => ({
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #0a3b7c 0%, #1fc1d7 100%)',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//     position: 'relative',
//     animation: `${float} 3s ease-in-out infinite 4s`,
// }));

// const LogoSvg = styled('svg')({
//     width: '300px',
//     height: 'auto',
//     filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
//     '& .letter-v, & .letter-d': {
//         animation: `${slideInLeft} 1.5s ease-out, ${slideInRight} 1.5s ease-out`,
//     },
//     '& .eye-container': {
//         animation: `${eyeAppear} 2s ease-out 0.5s both`,
//     },
//     '& .eye-iris': {
//         animation: `${pulseIris} 2s ease-in-out infinite 2s`,
//         transformOrigin: 'center',
//     },
//     '& .eye-pupil': {
//         animation: `${rotatePupil} 3s linear infinite 2.5s`,
//         transformOrigin: 'center',
//     },
//     '& .eye-highlight': {
//         animation: `${shimmer} 2s ease-in-out infinite 3s`,
//     },
//     '& .arrow': {
//         animation: `${growArrow} 1.5s ease-out 1s both`,
//         transformOrigin: 'bottom left',
//     },
// });


// const LoadingText = styled(Typography)(({ theme }) => ({
//     color: 'white',
//     fontSize: '16px',
//     marginTop: theme.spacing(3),
//     opacity: 0,
//     animation: `${fadeInText} 1s ease-out 0.5s both`,
//     '& .loading-dots': {
//         animation: `${dotPulse} 1.5s ease-in-out infinite 1s`,
//     },
// }));

// // Component props interface
// interface VDLogoLoaderProps {
//     loadingText?: string;
// }

// export const VDLogoLoader: React.FC<VDLogoLoaderProps> = ({
//     loadingText = "Loading"
// }) => {

//     return (
//         <LoaderContainer maxWidth={false}>
//             <Box>
//                 <LogoSvg viewBox="0 0 1203 746" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <g filter="url(#filter0_i_5_3)" className="eye-container">
//                         <path d="M687.938 309C569.438 309 491.938 431.5 491.938 431.5C491.938 431.5 580.938 545.744 687.938 549C802.938 552.5 891.438 428 891.438 428C891.438 428 806.438 309 687.938 309Z" fill="#F0F2F3" />
//                     </g>
//                     <path className="letter-v letter-d arrow" d="M977.438 235.554C977.528 235.662 1026.45 294.103 1034.94 347.554C1045.05 411.186 1044.88 454.748 1016.94 511.054C983.437 578.554 903.937 620.054 806.438 620.054C750.945 620.054 679.956 619.054 679.938 619.054V557.554H816.938C900.937 557.554 946.165 504.054 957.938 467.054C969.71 430.054 972.937 408.554 963.938 353.054C958.168 317.476 930.505 282.639 930.438 282.554L977.438 235.554ZM163.938 155.554C163.938 155.554 192.39 151.796 210.938 159.054C227.702 165.614 247.808 179.248 255.438 195.554C306.438 304.554 383.438 482.054 383.438 482.054C383.438 482.054 468.437 309.554 517.438 207.554C527.53 186.545 545.781 171.522 568.438 166.054C585.9 161.839 613.938 166.054 613.938 166.054C613.806 166.312 483.394 422.144 396.438 601.054C385.502 623.553 374.337 623.553 364.438 601.054C303.965 463.617 164.067 155.839 163.938 155.554ZM580.938 455.054C582.941 452.618 583.848 453.329 585.438 456.054C588.937 462.054 591.938 469.054 596.938 477.054C598.419 479.424 598.514 478.682 596.438 480.554C560.938 512.554 545.698 527.531 509.438 550.554C446.438 590.554 423.438 602.411 407.938 609.054C397.438 613.554 395.825 611.562 405.438 605.554C413.437 600.554 448.438 581.554 495.938 540.554C527.398 513.398 555.438 486.054 580.938 455.054ZM1023.11 110.984C1031.09 107.759 1031.44 107.621 1031.44 117.054C1031.44 149.054 1027.94 204.554 1027.94 204.554C1027.94 204.554 1020.44 198.054 1006.44 187.554C1003.97 185.701 1001.59 186.746 998.938 190.054C915.438 294.054 798.437 382.054 702.438 388.554C698.112 388.847 695.951 384.573 704.438 382.054C768.437 363.054 892.938 265.554 963.438 165.554C965.489 162.645 965.365 161.441 962.938 160.054C952.446 154.058 941.454 147.065 941.438 147.054C941.438 147.054 996.937 121.554 1022.94 111.054L1023.11 110.984ZM747.438 158.054C767.438 158.054 803.938 158.054 839.938 164.054C875.446 169.972 906.938 183.554 927.938 194.554L885.938 243.054C885.938 243.054 856.938 228.854 831.438 222.054C801.438 214.054 721.938 215.554 721.938 215.554C721.938 215.726 722.089 303.624 721.438 303.554C703.438 301.554 670.938 300.054 650.438 303.554V157.054L747.438 158.054Z" fill="url(#paint0_linear_5_3)" />
//                     <ellipse className="eye-iris" cx="687.938" cy="428.5" rx="112" ry="108.5" fill="url(#paint1_radial_5_3)" />
//                     <g filter="url(#filter1_f_5_3)" className="eye-pupil">
//                         <ellipse cx="687.938" cy="428.5" rx="68" ry="63.5" fill="#0A3B7C" />
//                     </g>
//                     <g filter="url(#filter2_f_5_3)" className="eye-highlight">
//                         <circle cx="655.938" cy="401" r="21" fill="url(#paint2_radial_5_3)" />
//                     </g>
//                     <defs>
//                         <filter id="filter0_i_5_3" x="491.938" y="309" width="399.5" height="240.072" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
//                             <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                             <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//                             <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
//                             <feMorphology radius="48" operator="erode" in="SourceAlpha" result="effect1_innerShadow_5_3" />
//                             <feOffset />
//                             <feGaussianBlur stdDeviation="20" />
//                             <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
//                             <feColorMatrix type="matrix" values="0 0 0 0 0.311538 0 0 0 0 0.308842 0 0 0 0 0.308842 0 0 0 0.95 0" />
//                             <feBlend mode="normal" in2="shape" result="effect1_innerShadow_5_3" />
//                         </filter>
//                         <filter id="filter1_f_5_3" x="609.938" y="355" width="156" height="147" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
//                             <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                             <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//                             <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_5_3" />
//                         </filter>
//                         <filter id="filter2_f_5_3" x="632.938" y="378" width="46" height="46" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
//                             <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                             <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//                             <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur_5_3" />
//                         </filter>
//                         <linearGradient id="paint0_linear_5_3" x1="796.937" y1="109" x2="602.937" y2="620" gradientUnits="userSpaceOnUse">
//                             <stop stopColor="#1FC1D7" />
//                             <stop offset="1" stopColor="#0A3B7C" />
//                         </linearGradient>
//                         <radialGradient id="paint1_radial_5_3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(687.938 429) rotate(90) scale(181 181)">
//                             <stop stopColor="#00E1FF" />
//                             <stop offset="0.456731" stopColor="#1FC1D7" />
//                             <stop offset="0.709423" stopColor="#0A3B7C" />
//                         </radialGradient>
//                         <radialGradient id="paint2_radial_5_3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(655.938 401) rotate(90) scale(21)">
//                             <stop stopColor="#D8EDE0" />
//                             <stop offset="0.25" stopColor="#E9E7DB" />
//                             <stop offset="0.5" stopColor="#F0E9D5" />
//                             <stop offset="0.75" stopColor="#EAE6E7" />
//                             <stop offset="1" stopColor="#F6FBFF" />
//                         </radialGradient>
//                     </defs>
//                 </LogoSvg>

//                 <LoadingText variant="body1">
//                     {loadingText}<span className="loading-dots">...</span>
//                 </LoadingText>
//             </Box>
//         </LoaderContainer>
//     );
// };

import React from 'react';
import { Box, keyframes, styled } from '@mui/material';

interface LoaderProps {
  size?: number;
  color?: string;
}

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

const blinkAnimation = keyframes`
  0%, 90%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
`;

const LoaderContainer = styled(Box)<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const OuterRing = styled(Box)<{ size: number; color: string }>(({ size, color }) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  border: `${size * 0.03}px solid transparent`,
  borderTop: `${size * 0.03}px solid ${color}`,
  borderRight: `${size * 0.03}px solid ${color}`,
  animation: `${rotateAnimation} 2s linear infinite`,
  position: 'absolute',
}));

const EyeContainer = styled(Box)<{ size: number }>(({ size }) => ({
  width: size * 0.6,
  height: size * 0.35,
  backgroundColor: '#f0f2f3',
  borderRadius: `${size * 0.3}px`,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  animation: `${pulseAnimation} 3s ease-in-out infinite`,
}));

const Iris = styled(Box)<{ size: number; color: string }>(({ size, color }) => ({
  width: size * 0.25,
  height: size * 0.25,
  borderRadius: '50%',
  background: `radial-gradient(circle at 30% 30%, #00e1ff, ${color}, #0a3b7c)`,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Pupil = styled(Box)<{ size: number }>(({ size }) => ({
  width: size * 0.08,
  height: size * 0.08,
  borderRadius: '50%',
  backgroundColor: '#000',
  position: 'relative',
}));

const Highlight = styled(Box)<{ size: number }>(({ size }) => ({
  width: size * 0.03,
  height: size * 0.03,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  position: 'absolute',
  top: '20%',
  left: '30%',
}));

const Eyelid = styled(Box)<{ size: number }>(({ size }) => ({
  width: size * 0.6,
  height: size * 0.35,
  backgroundColor: '#f0f2f3',
  borderRadius: `${size * 0.3}px`,
  position: 'absolute',
  top: 0,
  left: 0,
  transformOrigin: 'center bottom',
  animation: `${blinkAnimation} 4s ease-in-out infinite`,
}));

const LoadingText = styled(Box)<{ size: number; color: string }>(({ size, color }) => ({
  position: 'absolute',
  bottom: -size * 0.4,
  fontSize: size * 0.1,
  fontWeight: 600,
  color: color,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  letterSpacing: '0.1em',
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
}));

const VDLoader: React.FC<LoaderProps> = ({ 
  size = 120, 
  color = '#1fc1d7' 
}) => {
  return (
    <LoaderContainer size={size}>
      <OuterRing size={size} color={color} />
      <EyeContainer size={size}>
        <Iris size={size} color={color}>
          <Pupil size={size}>
            <Highlight size={size} />
          </Pupil>
        </Iris>
        <Eyelid size={size} />
      </EyeContainer>
      <LoadingText size={size} color={color}>
        Loading...
      </LoadingText>
    </LoaderContainer>
  );
};

export default VDLoader;