import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  AudioFile as AudioIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import useContentStore from "../../store/ContentStore";
import { Content } from "../../types/types";
import ShareModal from "./ShareModal";

interface ContentListProps {
  contentType?: string;
}

const ContentList = ({ contentType }: ContentListProps = {}) => {
  const {
    contents,
    loading,
    error,
    fetchContents,
    removeContent,
    shareContent,
  } = useContentStore();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

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
      case "tweet":
        return <TwitterIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const handleDelete = async (contentId: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await removeContent(contentId);
      } catch (err) {
        // Error is handled in the content store
        console.log(err);
      }
    }
  };

  const handleShareBrain = async () => {
    try {
      await shareContent(true);
      setShareModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredContents = contentType
    ? contents.filter((content) => content.type === contentType)
    : contents;

  if (loading && contents.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const pageTitle = contentType
    ? `${contentType.charAt(0).toUpperCase() + contentType.slice(1)}s`
    : "All Notes";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {pageTitle}
        </Typography>
        {/*duplicate buttons
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShareIcon />}
            sx={{
              bgcolor: "rgba(90, 64, 255, 0.1)",
              color: "primary.main",
              "&:hover": {
                bgcolor: "rgba(90, 64, 255, 0.2)",
              },
              borderRadius: 1.5,
              px: 2,
              py: 1,
              fontWeight: 600,
            }}
            onClick={handleShareBrain}
          >
            Share Brain
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard"
            sx={{
              borderRadius: 1.5,
              px: 2,
              py: 1,
              fontWeight: 600,
            }}
          >
            Add Content
          </Button>
        </Box>
        */}
      </Box>

      {filteredContents.length === 0 ? (
        <Box
          sx={{
            mt: 8,
            textAlign: "center",
            p: 6,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add some content to get started!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredContents.map((content: Content) => (
            <Grid item xs={12} sm={6} md={4} key={content._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  overflow: "visible",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "text.secondary",
                        }}
                      >
                        {getContentIcon(content.type)}
                      </Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {content.type.charAt(0).toUpperCase() +
                          content.type.slice(1)}{" "}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          color: "text.secondary",
                          p: 0.5,
                          "&:hover": {
                            color: "error.main",
                            bgcolor: "rgba(244, 67, 54, 0.08)",
                          },
                        }}
                        onClick={() => handleDelete(content._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    component="div"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      mb: 1.5,
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {content.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    component="a"
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {(() => {
                      switch (content.type) {
                        case "video":
                          return "Open Video";
                        case "image":
                          return "Open Image";
                        case "article":
                          return "Open Article";
                        case "audio":
                          return "Open Audio";
                        default:
                          return "Open Content";
                      }
                    })()}
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 2 }}
                  >
                    {Array.isArray(content.tags) &&
                      content.tags.map((tag: any) => (
                        <Chip
                          key={typeof tag === "string" ? tag : tag._id}
                          label={typeof tag === "string" ? tag : tag.title}
                          size="small"
                          sx={{
                            bgcolor: "rgba(90, 64, 255, 0.1)",
                            color: "primary.main",
                            borderRadius: 1,
                            height: 24,
                            fontSize: "0.75rem",
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      ))}
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 3 }}
                  >
                    Added on{" "}
                    {content.createdAt
                      ? new Date(content.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Unknown date"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </Box>
  );
};

export default ContentList;
