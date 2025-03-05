import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/AuthStore";
import { Box, CircularProgress, Container } from "@mui/material";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: "primary.main",
            }}
          />
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
