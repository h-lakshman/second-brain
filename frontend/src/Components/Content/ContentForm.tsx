import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  SelectChangeEvent,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  AudioFile as AudioIcon,
  Twitter as TwitterIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useState } from "react";
import useContentStore from "../../store/ContentStore";

const contentTypes = [
  { value: "tweet", label: "Tweet", icon: <TwitterIcon /> },
  { value: "video", label: "Video", icon: <VideoIcon /> },
  { value: "article", label: "Article", icon: <ArticleIcon /> },
  { value: "image", label: "Image", icon: <ImageIcon /> },
  { value: "audio", label: "Audio", icon: <AudioIcon /> },
];
const ContentForm = () => {
  const [title, setTitle] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [contentType, setContentType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    addContent,
    loading: submitLoading,
    error: serverError,
    clearError,
  } = useContentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!contentUrl || !title || !contentType) {
      setFormError("Please fill in all required fields");
      return;
    }

    let formattedUrl = contentUrl;
    if (
      !contentUrl.startsWith("http://") &&
      !contentUrl.startsWith("https://")
    ) {
      formattedUrl = `https://${contentUrl}`;
    }

    try {
      await addContent({
        link: formattedUrl,
        title,
        type: contentType,
        tags,
      });
      setSuccess("Content added successfully!");
      setContentUrl("");
      setTitle("");
      setContentType("");
      setTags([]);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to add content:", err);
    }
  };
  const handleTypeChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value as string);
  };
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Add New Content
      </Typography>
      {success && (
        <Alert
          severity="success"
          sx={{
            mb: 4,
            borderRadius: 2,
          }}
        >
          {success}
        </Alert>
      )}
      {(serverError || formError) && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 2,
          }}
        >
          {formError || serverError}
        </Alert>
      )}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              disabled={submitLoading}
              margin="normal"
              id="title"
              name="title"
              label="Title"
              value={title}
              placeholder="Enter a title for your content"
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
                "& .MuiInputBase-input": {
                  padding: "14px 16px",
                },
              }}
            />

            <TextField
              required
              fullWidth
              disabled={submitLoading}
              margin="normal"
              id="contentUrl"
              name="contentUrl"
              label="Content URL"
              placeholder="www."
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
                "& .MuiInputBase-input": {
                  padding: "14px 16px",
                },
              }}
            />

            <FormControl
              fullWidth
              margin="normal"
              required
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
                "& .MuiSelect-select": {
                  padding: "14px 16px",
                },
              }}
            >
              <InputLabel id="type-label">Content Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                label="Content Type"
                value={contentType}
                onChange={handleTypeChange}
                disabled={submitLoading}
              >
                {contentTypes.map((contentType) => (
                  <MenuItem key={contentType.value} value={contentType.value}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {contentType.icon}
                      </Box>
                      <Typography>{contentType.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, mb: 4 }}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                fontWeight={500}
                sx={{ mb: 2 }}
              >
                Tags
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextField
                  fullWidth
                  id="tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                    "& .MuiInputBase-input": {
                      padding: "10px 14px",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddTag}
                  disabled={submitLoading || !newTag.trim()}
                  sx={{
                    ml: 1.5,
                    minWidth: "auto",
                    borderRadius: 1.5,
                    height: 40,
                    width: 40,
                  }}
                >
                  {" "}
                  <AddIcon />
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  sx={{
                    bgcolor: "rgba(90, 64, 255, 0.1)",
                    color: "primary.main",
                    borderRadius: 1,
                    height: 32,
                    "& .MuiChip-label": { px: 1.5, fontWeight: 500 },
                    "& .MuiChip-deleteIcon": {
                      color: "primary.main",
                      fontSize: "18px",
                      "&:hover": {
                        color: "primary.dark",
                      },
                    },
                  }}
                ></Chip>
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              startIcon={submitLoading ? undefined : <SaveIcon />}
              sx={{
                mt: 2,
                borderRadius: 1.5,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
              }}
              disabled={submitLoading}
              fullWidth
            >
              {submitLoading ? <CircularProgress size={24} /> : "Save Content"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default ContentForm;
