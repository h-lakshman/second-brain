import { ReactNode } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Navbar from "./NavBar";
import useAuthStore from "../../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const drawerWidth = 240;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setTimeout(() => {
        navigate("/", { replace: true });
        setIsLoggingOut(false);
      }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {isLoggingOut && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Logging out...
          </Typography>
        </Box>
      )}
      <Navbar onLogout={handleLogout} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isAuthenticated
            ? { sm: `calc(100% - ${drawerWidth}px)` }
            : "100%",
          // ml: isAuthenticated ? { sm: `${drawerWidth}px` } : 0,
          pt: isAuthenticated ? { xs: 8, sm: 2 } : { xs: 2, sm: 8 },
          px: { xs: 1, sm: 3, md: 4 },
          pb: { xs: 2, sm: 4 },
          overflow: "auto",
          bgcolor: "background.default",
          transition: "margin 0.2s ease-in-out, width 0.2s ease-in-out",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
