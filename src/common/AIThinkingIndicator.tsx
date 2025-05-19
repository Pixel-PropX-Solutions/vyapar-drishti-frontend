import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Fade,
  LinearProgress,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Psychology, Search, AutoAwesome } from '@mui/icons-material';

// Define types for component props
interface AIThinkingIndicatorProps {
  isThinking: boolean;
  onComplete?: () => void;
  finalResponse?: React.ReactNode;
  thinkingDuration?: number; // Optional duration in ms for thinking animation
}

export const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({
  isThinking,
  onComplete,
  finalResponse,
  thinkingDuration = 8000 // Default 8 seconds for thinking process
}) => {
  const theme = useTheme();
  // AI thinking stages
  const thinkingStages = [
    { text: "Thinking", icon: <Psychology fontSize="small" /> },
    { text: "Analyzing request", icon: <Psychology fontSize="small" /> },
    { text: "Processing information", icon: <Search fontSize="small" /> },
    { text: "Searching knowledge base", icon: <Search fontSize="small" /> },
    { text: "Evaluating options", icon: <Psychology fontSize="small" /> },
    { text: "Formatting response", icon: <AutoAwesome fontSize="small" /> },
    { text: "Almost ready", icon: <AutoAwesome fontSize="small" /> }
  ];
  
  const [currentStage, setCurrentStage] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [dots, setDots] = useState('');
  const [typedResponse, setTypedResponse] = useState('');
  
  // Animate the thinking dots
  useEffect(() => {
    if (!isThinking) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isThinking]);
  
  // Progress through thinking stages
  useEffect(() => {
    if (!isThinking) return;
    
    let currentTimeout: NodeJS.Timeout;
    
    const advanceStage = (stage: number) => {
      if (stage >= thinkingStages.length) {
        // Thinking complete, show response
        setShowResponse(true);
        if (onComplete) onComplete();
        return;
      }
      
      setCurrentStage(stage);
      
      // Distribute stages evenly across thinkingDuration
      const stageTime = thinkingDuration / thinkingStages.length;
      // Add a small randomization (+/- 20%)
      const nextDelay = stageTime * (0.8 + Math.random() * 0.4);
      currentTimeout = setTimeout(() => advanceStage(stage + 1), nextDelay);
    };
    
    // Start the first stage
    advanceStage(0);
    
    return () => {
      if (currentTimeout) clearTimeout(currentTimeout);
    };
  }, [isThinking, onComplete, thinkingStages.length, thinkingDuration]);
  
  // Type out the final response
  useEffect(() => {
    if (!showResponse || !finalResponse || typeof finalResponse !== 'string') return;
    
    const text = finalResponse as string;
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(typingInterval);
        return;
      }
      
      setTypedResponse(text.substring(0, currentIndex + 1));
      currentIndex++;
    }, 15); // Speed of typing
    
    return () => clearInterval(typingInterval);
  }, [showResponse, finalResponse]);
  
  if (!isThinking && !showResponse) return null;
  
  return (
    <Fade in={isThinking || showResponse}>
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 400,
          p: 3,
          borderRadius: 2,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: showResponse 
            ? `0 0 15px ${theme.palette.primary.main}`
            : 'none',
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      >
        {/* Background wave animation */}
        {isThinking && !showResponse && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: '200% 100%',
              animation: 'wave 2s linear infinite',
              '@keyframes wave': {
                '0%': { backgroundPosition: '0% 0' },
                '100%': { backgroundPosition: '200% 0' }
              }
            }}
          />
        )}
        
        {isThinking && !showResponse && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress 
                size={28} 
                thickness={4} 
                sx={{ 
                  color: theme.palette.primary.main,
                  mr: 1 
                }}
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {thinkingStages[currentStage].icon}
                <Typography variant="h6" sx={{ fontWeight: 500, ml: 1 }}>
                  {thinkingStages[currentStage].text}{dots}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ position: 'relative', height: 6, mt: 1, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={((currentStage + 1) / thinkingStages.length) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundImage: `linear-gradient(45deg, 
                      ${theme.palette.primary.main} 25%, 
                      ${theme.palette.primary.light} 50%, 
                      ${theme.palette.primary.main} 75%)`,
                    backgroundSize: '200% 100%',
                    animation: 'shine 2s linear infinite',
                    '@keyframes shine': {
                      '0%': { backgroundPosition: '200% 0' },
                      '100%': { backgroundPosition: '-200% 0' }
                    }
                  }
                }}
              />
            </Box>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {currentStage < thinkingStages.length - 1 
                ? "AI is processing your request" 
                : "Preparing your response"}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 1,
              opacity: 0.7
            }}>
              <Box sx={{
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', opacity: 0.7 },
                  '50%': { transform: 'scale(1)', opacity: 1 },
                  '100%': { transform: 'scale(0.95)', opacity: 0.7 }
                }
              }}>
                <Psychology fontSize="large" sx={{ color: 'white' }} />
              </Box>
            </Box>
          </Box>
        )}
        
        {showResponse && (
          <Box sx={{ 
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}>
            {typeof finalResponse === 'string' ? (
              <Typography variant="body1">{typedResponse}</Typography>
            ) : (
              finalResponse
            )}
          </Box>
        )}
      </Paper>
    </Fade>
  );
};
