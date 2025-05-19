// import { Box, Grid, Typography } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ICity, IState } from "worldpedia/lib/interfaces";
// import { getAllCitiesOfState } from "worldpedia/lib/modules/cities";
// import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
// import { getAllStatesByCountry } from "worldpedia/lib/modules/states";
// import { useDispatch  } from "react-redux";
// import { AppDispatch } from "@/store/store";
// // import { setCustomDashboardData } from "@/store/reducers/authReducer";

// const Analysis = () => {
//   const [cities, setCities] = useState<ICity[]>([]);
//   const [states, setStates] = useState<IState[]>([]);
//   const [isOverflowing, setIsOverflowing] = useState(false);
//   const [currentData, setCurrentData] = useState({
//     country: "IN",
//     state: "",
//     city: "",
//   });
//   const [isAtBottom, setIsAtBottom] = useState(false);
//   const [message, setMessage] = useState("");
//   const contentRef = useRef<HTMLDivElement | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     setStates(
//       getAllStatesByCountry("IN").sort((a: IState, b: IState) =>
//         a.name.localeCompare(b.name)
//       )
//     );
//     setCities([]);
//   }, []);

//   useEffect(() => {
//     const checkOverflow = () => {
//       if (contentRef.current) {
//         const { scrollHeight, clientHeight } = contentRef.current;
//         setIsOverflowing(scrollHeight > clientHeight);
//       }
//     };

//     checkOverflow();
//     window.addEventListener("resize", checkOverflow);
//     return () => window.removeEventListener("resize", checkOverflow);
//   }, [states, cities]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (contentRef.current) {
//         const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
//         setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 5);
//       }
//     };

//     if (contentRef.current) {
//       contentRef.current.addEventListener("scroll", handleScroll);
//     }

//     return () => {
//       if (contentRef.current) {
//         contentRef.current.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, [states, cities]);

//   useEffect(() => {
//     if (states.length > 1 && cities.length < 1) {
//       setMessage("State or Union Territory");
//     } else if (states.length < 1 && cities.length > 1) {
//       setMessage("City");
//     }
//   }, [states, cities]);

//   const handleBackToStateSelection = () => {
//     setCities([]);
//     setCurrentData({ ...currentData, city: "" });
//     setStates(
//       getAllStatesByCountry("IN").sort((a: IState, b: IState) =>
//         a.name.localeCompare(b.name)
//       )
//     );
//   };

//   return (
//     <Box
//       sx={{
//         position: "absolute",
//         top: 0,
//         left: "0",
//         height: "100vh",
//         width: "100vw",
//         margin: 0,
//         padding: 0,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backdropFilter: "blur(10px)",
//         backgroundColor: "transparent",
//         zIndex: 9999,
//         overflow: "hidden",
//         "::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: 0,
//           margin: 0,
//           padding: 0,
//           width: "100%",
//           height: "100%",
//           backgroundImage: `url('https://res.cloudinary.com/dnkp2gm1d/image/upload/v1738849873/Drishti_Docs/bg_wfjsuc.png')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           filter: "blur(10px)",
//           zIndex: -1,
//         },
//       }}
//     >
//       <Grid
//         container
//         ref={contentRef}
//         rowSpacing={1}
//         columnSpacing={1}
//         sx={{
//           color: "#000",
//           zIndex: 4,
//           padding: "10px",
//           borderRadius: 2,
//           width: "900px",
//           height: "600px",
//           overflowY: "scroll",
//           scrollbarWidth: "none",
//           "&::-webkit-scrollbar": {
//             display: "none",
//           },
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//           margin: "auto",
//           border: `1px solid hsl(220, 20%, 80%)`,
//           background: "hsl(0, 0%, 100%)",
//           boxShadow:
//             "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
//           position: "relative",
//         }}
//       >
//         {states.map((state) => (
//           <Grid
//             item
//             xs={3}
//             key={state.isoCode}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               textAlign: "center",
//               margin: "auto",
//             }}
//           >
//             <Typography
//               onClick={() => {
//                 setCities(
//                   getAllCitiesOfState(state.isoCode, state.countryCode).sort(
//                     (a, b) => a.name.localeCompare(b.name)
//                   )
//                 );
//                 setCurrentData({ ...currentData, state: state.isoCode });
//                 setStates([]);
//               }}
//               sx={{
//                 margin: "0 6px",
//                 padding: "10px 20px",
//                 width: "100%",
//                 height: "fit-content",
//                 cursor: "pointer",
//                 borderRadius: 2,
//                 ":hover": {
//                   background: "hsla(220, 20%, 88%, .3)",
//                   border: `1px solid hsl(220, 20%, 80%)`,
//                   fontWeight: "200",
//                 },
//                 border: `1px solid #fff`,
//                 boxShadow:
//                   "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
//               }}
//             >
//               {state.name.slice(0, 17)}
//             </Typography>
//           </Grid>
//         ))}

//         {cities.map((city, index) => (
//           <Grid
//             item
//             xs={3}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               textAlign: "center",
//               margin: "auto",
//             }}
//             key={`${city.latitude ?? 0}-${city.longitude ?? index}`}
//           >
//             <Typography
//               onClick={() => {
//                 setCurrentData({ ...currentData, city: city.name });
//                 navigate("/dashboard");
//                 // dispatch(setCustomDashboardData(currentData));
//               }}
//               sx={{
//                 margin: "0 6px",
//                 padding: "10px 20px",
//                 width: "100%",
//                 height: "fit-content",
//                 cursor: "pointer",
//                 borderRadius: 2,

//                 border: `1px solid #fff`,
//                 boxShadow:
//                   "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
//               }}
//             >
//               {city.name}
//             </Typography>
//           </Grid>
//         ))}

//         {isOverflowing && !isAtBottom && (
//           <Typography
//             sx={{
//               position: "fixed",
//               bottom: 0,
//               width: "100%",
//               textAlign: "center",
//               background:
//                 "linear-gradient(to right bottom, #26d2d2, #006E89, #004b6b)",
//               padding: "6px 0",
//               fontSize: "14px",
//               fontWeight: "bold",
//               color: "white",
//               boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
//             }}
//           >
//             Scroll down for more...
//           </Typography>
//         )}
//         <Typography
//           sx={{
//             position: "fixed",
//             top: 0,
//             width: "100%",
//             textAlign: "center",
//             background:
//               "linear-gradient(to right bottom, #26d2d2, #006E89, #004b6b)",
//             padding: "6px 0",
//             fontSize: "14px",
//             fontWeight: "bold",
//             color: "white",
//             boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
//           }}
//         >
//           Select the {message}
//         </Typography>

//         {cities.length > 0 && (
//           <Box>
//             <Typography
//               onClick={handleBackToStateSelection}
//               sx={{
//                 position: "fixed",
//                 left: 50,
//                 top: "50%",
//                 width: "100px",
//                 height: "100px",
//                 transform: "translate(0, -50%) rotate(90deg)",
//                 textAlign: "center",
//                 borderRadius: "50%",
//                 background:
//                   "linear-gradient(to right bottom, #26d2d2, #006E89, #004b6b)",
//                 color: "white",
//                 padding: "0",
//                 boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
//                 cursor: "pointer",
//                 ":hover": {
//                   background:
//                     "linear-gradient(to left top, #26d2d2, #006E89, #004b6b)",
//                 },
//               }}
//             >
//               <ExpandCircleDownIcon
//                 fontSize="large"
//                 sx={{
//                   width: "100px",
//                   height: "100px",
//                 }}
//               />
//             </Typography>
//           </Box>
//         )}
//       </Grid>
//     </Box>
//   );
// };

// export default Analysis;
