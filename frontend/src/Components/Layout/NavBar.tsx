import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Second Brain</Typography>
        <Box>
          <Button
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => navigate("/register")}
          >
            Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
