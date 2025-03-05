import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Tab,
  Tabs,
  useTheme,
  Container,
  Tooltip,
  AppBar,
  Toolbar,
  Alert,
} from "@mui/material";
import ContentForm from "../Components/Content/ContentForm";
import ContentList from "../Components/Content/ListContents";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import useContentStore from "../store/ContentStore";
import { useLocation, useNavigate } from "react-router-dom";
import ShareModal from "../Components/Content/ShareModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const { fetchContents, contents, loading } = useContentStore();
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Determine which content type to display based on the route
  const getContentTypeFromPath = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "tweets":
        return "tweet";
      case "videos":
        return "video";
      case "documents":
        return "document";
      case "links":
        return "link";
      default:
        return null;
    }
  };

  const contentType = getContentTypeFromPath();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  // If we're on a specific content type route, just show that content
  // if (contentType) {
  //   return (
  //     <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
  //       <ContentList contentType={contentType} />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            My Second Brain
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleOpenShareModal}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Share Brain
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setTabValue(1)}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Content
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 1,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                color: theme.palette.text.secondary,
                py: 2,
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            }}
          >
            <Tab label="All Notes" />
            <Tab label="Add Content" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <ContentList />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ContentForm />
        </TabPanel>

        {/* Share Modal */}
        <ShareModal open={showShareModal} onClose={handleCloseShareModal} />
      </Container>
    </Box>
  );
};

export default Dashboard;
