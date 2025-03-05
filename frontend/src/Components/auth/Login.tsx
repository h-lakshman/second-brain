import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/AuthStore";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, registrationSuccessful, resetRegistrationState } =
    useAuthStore();

  useEffect(() => {
    if (registrationSuccessful) {
      setSuccess("Registration successful! Please login.");
      resetRegistrationState();
    }
  }, [registrationSuccessful, resetRegistrationState]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted!");
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={600}
              gutterBottom
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to your Second Brain
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            slotProps={{
              input: {
                sx: { borderRadius: 1.5 },
              },
            }}
          />

          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            slotProps={{
              input: {
                sx: { borderRadius: 1.5 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={!isLoading && <LoginIcon />}
            sx={{
              py: 1.5,
              borderRadius: 1.5,
              fontSize: "1rem",
              textTransform: "none",
            }}
          >
            {isLoading ? "Signing in" : "Sign in"}
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2"> Don't have an account? </Typography>
            <Link component={RouterLink} to="/register" fontWeight={500}>
              Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
