// import React from "react";
import {
    Box,
    CircularProgress,
} from "@mui/material";

interface Props {
    size?: number;
}

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    height: "100vh",
    width: "100vw",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "translate(-50%, -50%)",
    bgcolor: "transparent",
    backdropFilter: 'blur(12px)',
};

const CenterLoader = (props: Props) => {

    return (
        <Box sx={style}>
            <CircularProgress size={props.size ?? 40} />
        </Box>
    );
};

export default CenterLoader;
