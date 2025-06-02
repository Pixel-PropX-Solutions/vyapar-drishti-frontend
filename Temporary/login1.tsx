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


const LoginPage: React.FC = () => {
  const logoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [path, setPath] = useState<string>("");
  const id = useId();
  const [animationPhase, setAnimationPhase] = useState<"sixToCenter" | "centerToImage" | "slide">("sixToCenter");
  const [cycleKey, setCycleKey] = useState(0); // To force re-render of animations
  const duration = Math.random() * 3 + 4;
  const delay = 0;
  const pathColor = "gray";
  const pathWidth = 2;
  const pathOpacity = 0.2;
  const gradientStartColor = "#ffaa40";
  const gradientStopColor = "#9c40ff";
  const startXOffset = 0;
  const startYOffset = 0;
  const endXOffset = 0;
  const endYOffset = 0;
  const curvature = 0;
  const reverse = false;
  const gradientCoordinates = reverse
    ? {
      x1: ["90%", "-10%"],
      x2: ["100%", "0%"],
      y1: ["0%", "0%"],
      y2: ["0%", "0%"],
    }
    : {
      x1: ["10%", "110%"],
      x2: ["0%", "100%"],
      y1: ["0%", "0%"],
      y2: ["0%", "0%"],
    };


  useEffect(() => {
    const calculatePaths = () => {
      if (logoRefs.current.length >= 8) {
        const positions = logoRefs.current.map((ref) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 0, y: 0 };
        });

        const newPaths = positions.slice(0, 7).map((pos, index) => {
          const x1 = pos.x;
          const y1 = pos.y;
          const x2 = positions[7].x;
          const y2 = positions[7].y;

          // let controlX1 = 0, controlY1 = 0, controlX2 = 0, controlY2 = 0;
          // if (index === 0) {
          //   controlX1 = (x1 + x2) / 2; controlY1 = y1 - 10; controlX2 = (x1 + x2) / 2; controlY2 = y2 - 190;
          // } else if (index === 1) {
          //   controlX1 = (x1 + x2) / 2; controlY1 = y1 - 10; controlX2 = (x1 + x2) / 2; controlY2 = y2 - 100;
          // } else if (index === 2) {
          //   controlX1 = (x1 + x2) / 2; controlY1 = y1 - 10; controlX2 = (x1 + x2) / 2; controlY2 = y2 - 50;
          // } else if (index === 3) {
          //   return `M ${x1} ${y1} L ${x2} ${y2}`;
          // } else if (index === 4) {
          //   controlX1 = (x1 + x2) / 2; controlY1 = y1 - 10; controlX2 = (x1 + x2) / 2; controlY2 = y2 + 50;
          // } else if (index === 5) {
          //   controlX1 = (x1 + x2) / 2; controlY1 = y1 - 10; controlX2 = (x1 + x2) / 2; controlY2 = y2 + 100;
          // } else if (index === 6) {
          //   controlX1 = (x1 + x2) / 2; controlY1 = y1 - 10; controlX2 = (x1 + x2) / 2; controlY2 = y2 + 190;
          // }

          const controlY = y1 - curvature;
          return `M ${x1}, ${y1} Q ${(x1 + x2) / 2
            },${controlY} ${x2},${y2}`;
        });

        setPaths(newPaths);
      }
    };

    const calculatePath = () => {
      const positions = logoRefs.current.map((ref) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
        return { x: 0, y: 0 };
      });

      const x1 = positions[7].x;
      const y1 = positions[7].y;
      const x2 = positions[8].x;
      const y2 = positions[8].y;

      const controlX1 = (x1 + x2) / 2;
      const controlY1 = y1 + 60;
      const controlX2 = (x1 + x2) / 2;
      const controlY2 = y2 - 90;

      setPath(`M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`);
    };


    calculatePaths();
    calculatePath();
    window.addEventListener("resize", calculatePaths);
    window.addEventListener("resize", calculatePath);

    return () => {
      window.removeEventListener("resize", calculatePaths);
      window.removeEventListener("resize", calculatePath);
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (animationPhase === "sixToCenter") {
      timeoutId = setTimeout(() => {
        setAnimationPhase("centerToImage");
        setCycleKey((prev) => prev + 1); // Force re-render
      }, 3000);
    } else if (animationPhase === "centerToImage") {
      timeoutId = setTimeout(() => {
        setAnimationPhase("slide");
        setCycleKey((prev) => prev + 1); // Force re-render
      }, 3000);
    } else if (animationPhase === "slide") {
      timeoutId = setTimeout(() => {
        setAnimationPhase("sixToCenter"); // Restart loop
        setCycleKey((prev) => prev + 1); // Force re-render
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [animationPhase]);


  useEffect(() => {
    const calculatePaths = () => {

      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

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
        setPathD(d);
      }
    };

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      // For all entries, recalculate the path
      for (let entry of entries) {
        updatePath();
      }
    });

    // Observe the container element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Call the updatePath initially to set the initial path
    calculatePaths();

    // Clean up the observer on component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);
  return (
    <Grid container sx={{ height: "100vh", zIndex: 1, position: "relative" }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: "linear-gradient(to right bottom, #26d2d2, #006E89, #004B6B)",
          position: "relative",
          color: "white",
          display: "flex",
          zIndex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* SVG for sixToCenter animation */}
        <svg
          key={`sixToCenter-${cycleKey}`} // Unique key to force re-render
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
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
          {/* <defs>
            <linearGradient id="linear-gradient" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0" stopColor="#26d2d2" />
              <stop offset="1" stopColor="#006E89" />
            </linearGradient>
          </defs>
          {paths?.map((path, index) => (
            <g key={`path-${index}`}>
              <path d={path} fill="none" stroke="#00405C" strokeWidth="6" />
              {animationPhase === "sixToCenter" && (
                <circle r="4" fill="url(#linear-gradient)">
                  <animateMotion dur="3s" begin="0s" path={path} repeatCount="1" />
                </circle>
              )}
            </g>
          ))} */}
        </svg>

        {/* SVG for centerToImage animation */}
        <svg
          key={`centerToImage-${cycleKey}`} // Unique key to force re-render
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <defs>
            <linearGradient id="linear-gradient" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0" stopColor="#26d2d2" />
              <stop offset="1" stopColor="#006E89" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="#00405C" strokeWidth="6" />
          {animationPhase === "centerToImage" && (
            <circle r="4" fill="url(#linear-gradient)">
              <animateMotion dur="3s" begin="0s" path={path} repeatCount="1" />
            </circle>
          )}
        </svg>

        {/* Logos and layout */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            columnGap: "150px",
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {[Logo1, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7].map((logo, index) => (
              <img
                key={index}
                src={logo}
                ref={(el) => (logoRefs.current[index] = el)}
                alt={`Logo${index + 1}`}
                style={{
                  borderRadius: "50%",
                  margin: "10px",
                  height: "60px",
                  width: "60px",
                  zIndex: 1,
                  backgroundColor: "white",
                  padding: "5px",
                  objectFit: "contain",
                }}
              />
            ))}
          </Grid>

          <Box style={{ zIndex: 1 }}>
            <img
              src={Logo}
              alt="Logo"
              ref={(el) => (logoRefs.current[7] = el)}
              style={{
                borderRadius: "50%",
                margin: "5px",
                height: "100px",
                objectFit: "contain",
                width: "100px",
                backgroundColor: "white",
              }}
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: "translateY(-120px)",
            }}
          >
            <img
              src={centerImage}
              alt="Logo"
              ref={(el) => (logoRefs.current[8] = el)}
              style={{
                position: "absolute",
                top: "50%",
                left: "0px",
                zIndex: 10,
                filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
                borderRadius: "10px",
                height: "200px",
                objectFit: "contain",
              }}
            />
            <img
              src={centerImage}
              alt="Logo"
              style={{
                position: "absolute",
                top: "50%",
                left: "0px",
                zIndex: 10,
                filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25))",
                borderRadius: "10px",
                height: "200px",
                objectFit: "contain",
                animation: animationPhase === "slide" ? "slide 3s linear" : "none",
              }}
            />
          </Box>
        </Grid>

        {/* CSS for slide animation */}
        <style>
          {`
            @keyframes slide {
              0% { transform: translateX(0); opacity: 1; }
              50% { transform: translateX(50px); opacity: 0.5; }
              100% { transform: translateX(0); opacity: 1; }
            }
          `}
        </style>
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

