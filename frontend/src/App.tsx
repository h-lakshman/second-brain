import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from "@mui/material";
import SharedContent from "./Pages/SharedContent";
import ListContents from "./Components/Content/ListContents";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
const theme = createTheme({
  palette: {
    primary: {
      main: "#5A40FF", // Purple
      light: "#8A75FF",
      dark: "#4930CC",
    },
    secondary: {
      main: "#FF6B6B", // Coral
      light: "#FF9B9B",
      dark: "#E54D4D",
    },
    background: {
      default: "#F8F9FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1D1F",
      secondary: "#6F767E",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@font-face": {
          fontFamily: "Inter",
          fontStyle: "normal",
          fontDisplay: "swap",
          fontWeight: 400,
          src: `url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap)`,
        },
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #EAEDF3",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "rgba(90, 64, 255, 0.08)",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "html, body, #root": {
            height: "100%",
            width: "100%",
            margin: 0,
            padding: 0,
          },
          "#root": {
            display: "flex",
            flexDirection: "column",
          },
          a: {
            textDecoration: "none",
            color: "inherit",
          },
          "*": {
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
          },
        }}
      />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<ListContents />} />
            </Route>
            <Route path="/shared/:shareLink" element={<SharedContent />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Redirect for any other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
