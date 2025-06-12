import React, { useEffect, useId, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import centerImage from "../assets/4.jpeg";
import Logo1 from "../assets/1.png";
import Logo2 from "../assets/2.png";
import Logo3 from "../assets/3.png";
import Logo4 from "../assets/4.png";
import Logo5 from "../assets/5.png";
import Logo6 from "../assets/6.png";
import Logo7 from "../assets/7.png";
import Logo from "../assets/Logo.png";
import LoginForm from "@/features/auth/components/LoginForm";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";


const LoginPage: React.FC = () => {
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");
  const id = useId();
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [animationPhase, setAnimationPhase] = useState<"sixToCenter" | "centerToImage" | "slide">("sixToCenter");
  const duration = 9;
  const delay = 0;
  const pathColor = "silver";
  const pathWidth = 6;
  const pathOpacity = 0.5;
  const gradientStartColor = "#ffaa40";
  const gradientStopColor = "#9c40ff";
  const startXOffset = 0;
  const startYOffset = 0;
  const endXOffset = 0;
  const endYOffset = 0;
  const curvature = 0;

  const gradientCoordinates = {
    x1: ["10%", "110%"],
    x2: ["0%", "100%"],
    y1: ["0%", "0%"],
    y2: ["0%", "0%"],
  };


  useEffect(() => {
    const calculatePaths = () => {
      if (logoRefs.current.length >= 8) {
        const newPaths = logoRefs.current.slice(0, 7).map((pos) => {
          if (!pos) {
            return "";
          }
          if (!containerRef.current) {
            return "";
          }

          const containerRect = containerRef.current.getBoundingClientRect();
          const rectA = pos.getBoundingClientRect();
          const rectB = logoRefs.current[7]?.getBoundingClientRect();

          if (!rectB) {
            return "";
          }
          const svgWidth = containerRect.width;
          const svgHeight = containerRect.height;
          setSvgDimensions({ width: svgWidth, height: svgHeight });

          const startX =
            rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
          const startY =
            rectA.top - containerRect.top + rectA.height / 2 + startYOffset;

          const endX =
            rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
          const endY =
            rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

          const controlY = startY - curvature;
          const d = `M ${startX},${startY} Q ${(startX + endX) / 2
            },${controlY} ${endX},${endY}`;
          return d;
        });

        setPaths(newPaths.filter(Boolean));
      }
    };

    const calculatePath = () => {

      if (!containerRef.current) {
        return "";
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const rectA = logoRefs.current[7]?.getBoundingClientRect();
      const rectB = logoRefs.current[8]?.getBoundingClientRect();

      if (!rectB) {
        return "";
      }

      if (!rectA) {
        return "";
      }
      const svgWidth = containerRect.width;
      const svgHeight = containerRect.height;
      setSvgDimensions({ width: svgWidth, height: svgHeight });

      const startX =
        rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
      const startY =
        rectA.top - containerRect.top + rectA.height / 2 + startYOffset;

      const endX =
        rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
      const endY =
        rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

      const controlY = startY - curvature;
      const d = `M ${startX},${startY} Q ${(startX + endX) / 2
        },${controlY} ${endX},${endY}`;
      setPath(d);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
<<<<<<< HEAD
        console.log("ResizeObserver entry:", entry);
=======
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
        calculatePaths();
        calculatePath();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    calculatePaths();
    calculatePath();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (animationPhase === "sixToCenter") {
      timeoutId = setTimeout(() => {
        setAnimationPhase("centerToImage");
      }, 1500);
    } else if (animationPhase === "centerToImage") {
      timeoutId = setTimeout(() => {
        setAnimationPhase("slide");
      }, 1500);
    } else if (animationPhase === "slide") {
      timeoutId = setTimeout(() => {
        setAnimationPhase("sixToCenter"); // Restart loop
      }, 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [animationPhase]);

  return (
    <Grid container sx={{ height: "100vh", zIndex: 1, position: "relative" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: "linear-gradient(to right bottom, #26d2d2, #006E89, #004B6B)",
          color: "white",
          display: "flex",
          width: "100%",
          zIndex: 1,
          justifyContent: "center",
          padding: "0 40px",
          flexDirection: "column",
        }}
      >
        {/* Logos and layout */}
        <div ref={containerRef}
          style={{
            color: "white",
            position: 'relative',
            display: "flex",
            width: '100%',
            margin: '0 auto',
            marginLeft: '130px',
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            columnGap: "130px",
          }}>
          <svg
            fill="none"
            width={svgDimensions.width}
            height={svgDimensions.height}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
            )}
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          >
            {paths.map((pathD, index) =>
            (
              <React.Fragment key={index}>
                <path
                  d={pathD}
                  stroke={pathColor}
                  strokeWidth={pathWidth}
                  strokeOpacity={pathOpacity}
                  strokeLinecap="round"
                />
                <path
                  d={pathD}
                  strokeWidth={pathWidth}
                  stroke={`url(#${id})`}
                  strokeOpacity="1"
                  strokeLinecap="round"
                />
              </React.Fragment>
            )
            )
            }
            <defs>
              <motion.linearGradient
                className="transform-gpu"
                id={id}
                gradientUnits={"userSpaceOnUse"}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: gradientCoordinates.x1,
                  x2: gradientCoordinates.x2,
                  y1: gradientCoordinates.y1,
                  y2: gradientCoordinates.y2,
                }}
                // onAnimationComplete={() => {
                //   if (animationPhase === "sixToCenter") {
                //     setAnimationPhase("centerToImage");
                //   } else if (animationPhase === "centerToImage") {
                //     setAnimationPhase("slide");
                //   }
                // }}
                transition={{
                  delay,
                  duration,
                  ease: [0.16, 1, 0.3, 1], // https://easings.net/#easeOutExpo
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
                <stop stopColor={gradientStartColor}></stop>
                <stop offset="32.5%" stopColor={gradientStopColor}></stop>
                <stop
                  offset="100%"
                  stopColor={gradientStopColor}
                  stopOpacity="0"
                ></stop>
              </motion.linearGradient>
            </defs>
          </svg>
          <svg
            fill="none"
            width={svgDimensions.width}
            height={svgDimensions.height}
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
            )}
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          >
            <path
              d={path}
              stroke={pathColor}
              strokeWidth={pathWidth}
              strokeOpacity={pathOpacity}
              strokeLinecap="round"
            />
            <path
              d={path}
              strokeWidth={pathWidth}
              stroke={`url(#${id})`}
              strokeOpacity="1"
              strokeLinecap="round"
            />
            <defs>
              <motion.linearGradient
                className="transform-gpu"
                id={id}
                gradientUnits={"userSpaceOnUse"}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                onAnimationComplete={() => {
                  setAnimationPhase("slide");
                }}
                animate={{
                  x1: gradientCoordinates.x1,
                  x2: gradientCoordinates.x2,
                  y1: gradientCoordinates.y1,
                  y2: gradientCoordinates.y2,
                }}
                transition={{
                  delay,
                  duration,
                  ease: [0.16, 1, 0.3, 1], // https://easings.net/#easeOutExpo
                  repeat: Infinity,
                  repeatDelay: 0,
                }}
              >
                <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
                <stop stopColor={gradientStartColor}></stop>
                <stop offset="32.5%" stopColor={gradientStopColor}></stop>
                <stop
                  offset="100%"
                  stopColor={gradientStopColor}
                  stopOpacity="0"
                ></stop>
              </motion.linearGradient>
            </defs>
          </svg>

          {/* 7 Logos */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",

            }}>
            {[Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7].map((logo, index) => (
              <div key={index} ref={(el) => (logoRefs.current[index] = el)} style={{
                zIndex: 10,
                height: "70px",
                width: "70px",
                marginTop: "10px",
                marginBottom: "10px",
              }}>
                <img
                  src={logo}
                  alt={`Logo${index + 1}`}
                  style={{
                    borderRadius: "50%",
                    zIndex: 10,
                    backgroundColor: "white",
                    padding: "5px",
                    objectFit: "contain",
                  }}
                />
              </div>

            ))}
          </div>

          {/* Main Logo */}
          <div
            style={{
              zIndex: 100,
              height: "100px",
              width: "100px",
              objectFit: "contain",
            }}
            ref={(el) => (logoRefs.current[7] = el)}>
            <img
              src={Logo}
              alt="Logo"
              style={{
                borderRadius: "50%",
                height: "100px",
                width: "fit-content",
                // aspectRatio: "1/1",
                objectFit: "contain",
                backgroundColor: "white",
              }}
            />
          </div>

          {/* Center Image with animation */}
          <div
            ref={(el) => (logoRefs.current[8] = el)}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: "200px",
              width: "200px",
              zIndex: 100,
              overflow: "visible",
            }}
          >
            <img
              src={centerImage}
              alt="Logo"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
                borderRadius: "10px",
                height: "200px",
                width: "200px",
                objectFit: "contain",
              }}
            />
            <img
              src={centerImage}
              alt="Logo"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: 110,
                filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
                borderRadius: "10px",
                height: "200px",
                width: "200px",
                objectFit: "contain",
                // animationDelay: animationPhase === "slide" ? "0s" : "3s",
                // animationDuration: "3s",
                transitionDelay: "0s",
                // animationTimingFunction: "ease-in-out",
                animation: animationPhase === "slide" ? "slide 3s infinite" : "none",
              }}
            />
            <style>
              {`
            @keyframes slide {
              0% { transform: translateX(0); opacity: 1; }
              50% { transform: translateX(50px); opacity: 0.5; }
              100% { transform: translateX(0); opacity: 1; }
            }
            `}
            </style>
          </div>
        </div>
      </Grid>

      {/* Right Section */}
      <Grid
        item
        sm={12}
        md={6}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <LoginForm />
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;

