import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static" sx={{ bgcolor: "black"}}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: "1.5rem", sm: "2rem" }}}>
          Directorio de Empleados
        </Typography>
      </Toolbar>
    </AppBar>
    </Box>
  );
}