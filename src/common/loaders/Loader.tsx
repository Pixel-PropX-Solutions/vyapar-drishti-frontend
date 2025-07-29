import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  LinearProgress, 
  Fade,
  useTheme
} from '@mui/material';
import { CloudUpload, Check, Warning } from '@mui/icons-material';

// Define types for component props
interface DocumentUploadLoaderProps {
  isUploading: boolean;
  progress?: number;
  fileName?: string;
  fileSize?: number;
  error?: string;
  onComplete?: () => void;
}

export const DocumentUploadLoader: React.FC<DocumentUploadLoaderProps> = ({
  isUploading,
  progress = 0,
  fileName = "document.pdf",
  fileSize = 0,
  error,
  onComplete
}) => {
  const theme = useTheme();
  const [showCheck, setShowCheck] = useState<boolean>(false);
  const [status, setStatus] = useState<'uploading' | 'success' | 'error'>('uploading');
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Animated dots for text
  const [dots, setDots] = useState('');
  useEffect(() => {
    if (!isUploading && status === 'success') return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isUploading, status]);

  // Handle completion of upload and analysis phases
  useEffect(() => {
    if (progress >= 100 && isUploading) {
      // First transition to analyzing
        setStatus('success');
        setShowCheck(true);
        const completeTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
      return () => clearTimeout(completeTimer);
    }
  }, [progress, isUploading, onComplete]);

  // Handle error state
  useEffect(() => {
    if (error) {
      setStatus('error');
    }
  }, [error]);

  // Particle animation for success
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string; }[]>([]);
  
  useEffect(() => {
    if (status === 'success' && showCheck) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 3,
        color: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main
        ][Math.floor(Math.random() * 3)]
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, showCheck, theme.palette]);

  // Get the current status message
  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return `Uploading${dots}`;
      case 'success':
        return 'Processing Complete!';
      case 'error':
        return 'Upload Failed';
      default:
        return '';
    }
  };

  // Get the progress indicator
  const getProgressIndicator = () => {
    if (status === 'success') {
      return (
        <Box
          sx={{
            mr: 2,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: theme.palette.success.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'scaleIn 0.5s ease-out',
            '@keyframes scaleIn': {
              '0%': { transform: 'scale(0)' },
              '80%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
        >
          <Check sx={{ color: 'white' }} />
        </Box>
      );
    } else if (status === 'error') {
      return (
        <Box
          sx={{
            mr: 2,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: theme.palette.error.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'shake 0.5s ease-in-out',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
              '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
            }
          }}
        >
          <Warning sx={{ color: 'white' }} />
        </Box>
      );
    } else {
      return (
        <CircularProgress 
          size={40} 
          thickness={4}
          sx={{ 
            mr: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.6 }
            }
          }} 
        />
      );
    }
  };

  // Get the secondary status message
  const getSecondaryStatusMessage = () => {
    if (status === 'uploading') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CloudUpload fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
          <Typography variant="body2" color="primary">
            Processing...
          </Typography>
        </Box>
      );
    } 
    return null;
  };

  // If not uploading and not in any processing state, don't render
  if (!isUploading && status === 'uploading') return null;

  return (
    <Fade in={isUploading || ['success'].includes(status)}>
      <Paper
        elevation={4}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 400,
          p: 3,
          borderRadius: 1,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: status === 'success' 
            ? `0 0 15px ${theme.palette.success.main}`
            : status === 'error'
            ? `0 0 15px ${theme.palette.error.main}`
            : 'none',
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      >
        {/* Success particles animation */}
        {particles.map(particle => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: showCheck ? 1 : 0,
              animation: 'float 2s ease-in-out infinite',
              '@keyframes float': {
                '0%': { transform: 'translateY(0)', opacity: 1 },
                '100%': { transform: 'translateY(-100px)', opacity: 0 }
              },
              animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getProgressIndicator()}

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {getStatusMessage()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {fileName} {fileSize > 0 && `(${formatFileSize(fileSize)})`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', height: 8, mb: 1 }}>
          <LinearProgress
            variant={"determinate"}
            value={status === 'success' ? 100 : progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: status === 'error' 
                  ? theme.palette.error.main 
                  : theme.palette.primary.main,
                backgroundImage: status !== 'error' 
                  ? `linear-gradient(45deg, 
                      ${theme.palette.primary.main} 25%, 
                      ${theme.palette.primary.light} 50%, 
                      ${theme.palette.primary.main} 75%)`
                  : 'none',
                backgroundSize: '200% 100%',
                animation: status !== 'error' ? 'shine 2s linear infinite' : 'none',
                '@keyframes shine': {
                  '0%': { backgroundPosition: '200% 0' },
                  '100%': { backgroundPosition: '-200% 0' }
                }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="textSecondary">
            {status === 'uploading' && `${Math.round(progress)}%`}
            {status === 'success' && 'Complete'}
            {status === 'error' && error}
          </Typography>
          {getSecondaryStatusMessage()}
        </Box>
      </Paper>
    </Fade>
  );
};