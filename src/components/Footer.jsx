import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

export default function Footer() {
    return (
        <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="white" align="center">
            {"Desarrollado con ❤️ - "}
            <Link color="inherit" href="https://github.com/pgoeppin">
            Pablo Goeppinger
            </Link>
            {" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
        </Box>
    );
}
