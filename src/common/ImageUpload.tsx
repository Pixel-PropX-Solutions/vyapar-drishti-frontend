import React from "react";
import { Avatar, Box, Chip, Fade, IconButton, Tooltip, Typography, Zoom } from "@mui/material";
import theme from "@/theme";
import { PhotoCamera, Delete, CloudUpload } from "@mui/icons-material";

interface ImageUploadProps {
    title: string;
    inputRef: React.RefObject<HTMLInputElement>;
    imagePreview: string | null;
    isDragActive: boolean;
    handleImageChange: (file: File) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    removeImage: (e: React.MouseEvent) => void;
    handleBoxClick: () => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    title,
    inputRef,
    imagePreview,
    isDragActive,
    handleImageChange,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    removeImage,
    handleBoxClick,
}) => {
    return (
        <Box sx={{ width: '100%', position: 'relative' }} >
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhotoCamera fontSize="small" color="primary" />
                {title}
                <Chip label="Optional" size="small" color="default" variant="outlined" />
            </Typography>

            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageChange(file);
                }}
            />

            <Box
                onClick={handleBoxClick}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                sx={{
                    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                    borderRadius: 1,
                    p: 3,
                    position: 'relative',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: isDragActive ? theme.palette.primary.main + '10' : theme.palette.background.default,
                    minHeight: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.main + '05',
                    },
                }}
            >
                {imagePreview ? (
                    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar
                            src={imagePreview}
                            alt="Profile Preview"
                            sx={{
                                width: 100,
                                height: 100,
                                border: `3px solid ${theme.palette.primary.main}`,
                                boxShadow: theme.shadows[2],
                                transition: 'all 0.3s ease',
                                objectFit: 'contain',
                            }}
                        />
                        <Tooltip title="Remove image" TransitionComponent={Zoom}>
                            <IconButton
                                onClick={removeImage}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: theme.palette.error.main,
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: theme.palette.error.dark,
                                        transform: 'scale(1.1)'
                                    },
                                    width: 28,
                                    height: 28,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
                            Click to change image
                        </Typography>
                    </Box>
                ) : (
                    <Fade in={true} timeout={500}>
                        <Box>
                            <CloudUpload
                                sx={{
                                    fontSize: 48,
                                    color: theme.palette.primary.main,
                                    mb: 1
                                }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Upload {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Drag & drop or click to browse
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                PNG, JPEG, JPG, WebP • Max 5MB
                            </Typography>
                        </Box>
                    </Fade>
                )}
            </Box>

        </Box>

    );
};

export default ImageUpload;