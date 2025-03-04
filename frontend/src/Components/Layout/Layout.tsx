import { ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "./NavBar";
import useAuthStore from "../../store/AuthStore";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuthStore();
  const drawerWidth = 240;
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isAuthenticated
            ? { sm: `calc(100% - ${drawerWidth}px)` }
            : "100%",
          // ml: isAuthenticated ? { sm: `${drawerWidth}px` } : 0,
          pt: isAuthenticated ? { xs: 8, sm: 2 } : 8,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
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
