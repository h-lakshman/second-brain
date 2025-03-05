import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import useAuthStore from "../../store/AuthStore";

const drawerWidth = 240;

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "My Content", icon: <CollectionsBookmarkIcon />, path: "/content" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

interface NavbarProps {
  onLogout: () => void;
}

const Navbar = ({ onLogout }: NavbarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isAuthenticated, logout } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Second Brain
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ mt: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isSelected =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isSelected}
                sx={{
                  py: 1.5,
                  mx: 1,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.light",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isSelected ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {isAuthenticated && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: "text.secondary",
              justifyContent: "flex-start",
              textTransform: "none",
              transition: "all 0.2s ease-in-out",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                bgcolor: "action.hover",
                color: "error.main",
                transform: "translateX(4px)",
                "& .MuiButton-startIcon": {
                  transform: "translateX(4px)",
                },
              },
              "& .MuiButton-startIcon": {
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );

  if (!isAuthenticated) {
    return (
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: "100%",
          left: 0,
          right: 0,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Second Brain
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/register")}
            sx={{ ml: 1 }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      {/* Mobile App Bar Only */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: drawerWidth / 16 },
          display: { sm: "none" },
          bgcolor: "background.paper",
          color: "text.primary",
        }}
        elevation={1}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            Second Brain
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            edge="end"
            color="inherit"
            aria-label="user menu"
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
              boxShadow: 3,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            width: 200,
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
