
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { alpha, Avatar, Zoom } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


export const StatCard = ({ title, value, subtitle, icon, color, trend }: any) => (
  <Zoom in timeout={300}>
    <Card
      elevation={0}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
          border: `1px solid ${alpha(color, 0.2)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              fontWeight="700"
              sx={{
                color: color,
                mb: 0.5,
                fontSize: { xs: '1.75rem', sm: '2.25rem' }
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Box display="flex" alignItems="center" gap={0.5}>
                {trend && (
                  trend > 0 ?
                    <ArrowUpward sx={{ fontSize: 14, color: 'success.main' }} /> :
                    <ArrowDownward sx={{ fontSize: 14, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: trend > 0 ? 'success.main' : 'text.secondary',
                    fontWeight: 500
                  }}
                >
                  {subtitle}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  </Zoom>
);
