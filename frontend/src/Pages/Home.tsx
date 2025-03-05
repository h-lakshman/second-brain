import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
  Alert,
} from "@mui/material";
import {
  Psychology as BrainIcon,
  Search as SearchIcon,
  Share as ShareIcon,
  AutoAwesome as AutoAwesomeIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import useAuthStore from "../store/AuthStore";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated } = useAuthStore();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as { logoutSuccess?: boolean };
    if (state?.logoutSuccess) {
      setSuccess("Logged out successfully!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
  }, [location]);

  const features = [
    {
      title: "Organize Everything",
      description:
        "Store and organize all your digital content in one place - tweets, videos, documents, and links.",
      icon: <SearchIcon fontSize="large" color="primary" />,
    },
    {
      title: "Smart Tagging",
      description:
        "Categorize your content with tags for easy retrieval and better organization.",
      icon: <AutoAwesomeIcon fontSize="large" color="primary" />,
    },
    {
      title: "Easy Sharing",
      description:
        "Share your curated content collections with friends, colleagues, or the public.",
      icon: <ShareIcon fontSize="large" color="primary" />,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create an account",
      description: "Sign up for free and start building your second brain.",
    },
    {
      number: "02",
      title: "Save content",
      description:
        "Add tweets, videos, documents, and links to your collection.",
    },
    {
      number: "03",
      title: "Organize with tags",
      description: "Tag your content for easy retrieval and organization.",
    },
    {
      number: "04",
      title: "Access anywhere",
      description: "Access your second brain from any device, anytime.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {success && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        </Container>
      )}
      <Box
        sx={{
          pt: { xs: 10, md: 16 },
          pb: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${theme.palette.primary.light}20 0%, rgba(255,255,255,0) 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    mb: 2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Your Digital Second Brain
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Organize your digital life by storing and categorizing tweets,
                  videos, documents, and links in one place.
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  {isAuthenticated ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/dashboard")}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/register")}
                        sx={{
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        Get Started
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/login")}
                        sx={{
                          py: 1.5,
                          px: 3,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </Stack>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <BrainIcon
                  sx={{
                    fontSize: 280,
                    color: "primary.main",
                    opacity: 0.8,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Key Features
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Everything you need to organize your digital content effectively
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Get started with Second Brain in just a few simple steps
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: "primary.main",
                      opacity: 0.3,
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    {step.number}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          mb: { xs: 2, md: 4 },
          mx: { xs: 2, md: 4 },
          background: `linear-gradient(45deg, ${theme.palette.primary.main}80 0%, ${theme.palette.secondary.main}80 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "white",
              }}
            >
              Ready to organize your digital life?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: "white",
                opacity: 0.9,
                fontWeight: 400,
              }}
            >
              Join thousands of users who have transformed how they manage
              digital content
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate(isAuthenticated ? "/dashboard" : "/register")
              }
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "white",
                  opacity: 0.9,
                },
              }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
