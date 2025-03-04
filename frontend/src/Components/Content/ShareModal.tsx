import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import useContentStore from "../../store/ContentStore";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

const ShareModal = ({ open, onClose }: ShareModalProps) => {
  const { shareLink, contents, createShareLink, removeShareLink, loading } =
    useContentStore();
  const [copied, setCopied] = useState(false);
  const [isShared, setIsShared] = useState(Boolean(shareLink));

  useEffect(() => {
    setIsShared(Boolean(shareLink));
  }, [shareLink]);

  const handleShare = async () => {
    try {
      if (shareLink) {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        await createShareLink();
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleShareBrain = async () => {
    try {
      if (isShared) {
        await removeShareLink();
        setIsShared(false);
      } else {
        await createShareLink();
        setIsShared(true);
      }
    } catch (error) {
      console.error("Error sharing brain:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          overflow: "visible",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Share Your Second Brain
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: "background.default",
              "&:hover": {
                bgcolor: "background.default",
                opacity: 0.8,
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Share your entire collection of notes, documents, tweets, and videos
          with others. They'll be able to import your content into their own
          Second Brain.
        </Typography>

        {shareLink && (
          <TextField
            fullWidth
            value={shareLink}
            variant="outlined"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleShare}
                    color="primary"
                    sx={{ minWidth: "auto", p: 1 }}
                  >
                    <ContentCopyIcon />
                  </Button>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 1.5,
                bgcolor: "background.default",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                py: 0.5,
                px: 1.5,
                fontFamily: "monospace",
                fontSize: "0.875rem",
              },
            }}
            sx={{ mb: 3 }}
          />
        )}

        <Button
          variant="contained"
          fullWidth
          startIcon={
            loading ? undefined : isShared ? <LinkOffIcon /> : <ShareIcon />
          }
          onClick={handleShareBrain}
          disabled={loading}
          sx={{
            py: 1.5,
            mb: 3,
            bgcolor: isShared ? "error.main" : "primary.main",
            color: "white",
            borderRadius: 1.5,
            fontWeight: 600,
            fontSize: "1rem",
            "&:hover": {
              bgcolor: isShared ? "error.dark" : "primary.dark",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : copied ? (
            "Link Copied!"
          ) : isShared ? (
            "Remove Sharing"
          ) : (
            "Share Brain"
          )}
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            bgcolor: "background.default",
            py: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {contents.length} {contents.length === 1 ? "item" : "items"} will be
            shared
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
