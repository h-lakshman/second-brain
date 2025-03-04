import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Paper,
} from "@mui/material";
import {
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  AudioFile as AudioIcon,
  OpenInNew as OpenInNewIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import useContentStore from "../store/ContentStore";
import { Content } from "../types/types";

const SharedContent = () => {
  const { shareLink } = useParams<{ shareLink: string }>();
  const { sharedContents, loading, error, fetchSharedContents } =
    useContentStore();

  useEffect(() => {
    if (shareLink) {
      fetchSharedContents(shareLink);
    }
  }, [shareLink, fetchSharedContents]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon />;
      case "video":
        return <VideoIcon />;
      case "article":
        return <ArticleIcon />;
      case "audio":
        return <AudioIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  if (loading && sharedContents.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (sharedContents.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="text.secondary">
            No shared content found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            This shared link may have been removed or is invalid.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Get the username from the first content item
  const username = sharedContents[0]?.userId?.username || "Anonymous";

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PersonIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="h4" component="h1">
              {username}'s Shared Brain
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            This is a collection of content shared by {username}. Browse through
            their curated resources below.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {sharedContents.map((content: Content) => (
            <Grid item xs={12} sm={6} md={4} key={content._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {getContentIcon(content.type)}
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{ ml: 1 }}
                    >
                      {content.type.charAt(0).toUpperCase() +
                        content.type.slice(1)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    {content.title}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Link
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {Array.isArray(content.tags) &&
                      content.tags.map((tag: any) => (
                        <Chip
                          key={typeof tag === "string" ? tag : tag._id}
                          label={typeof tag === "string" ? tag : tag.title}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SharedContent;
