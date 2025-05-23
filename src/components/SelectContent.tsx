import { 
  ListItem, 
  Divider, 
  Typography, 
  Box, 
  Tooltip 
} from '@mui/material';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png";

// Enhanced styled components
// const Avatar = styled(MuiAvatar)(({ theme }) => ({
//   width: 36,
//   height: 36,
//   backgroundColor: theme.palette.primary.light,
//   color: theme.palette.primary.contrastText,
//   boxShadow: theme.shadows[1],
//   transition: 'transform 0.2s ease-in-out',
//   '&:hover': {
//     transform: 'scale(1.05)',
//   }
// }));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: theme.palette.primary.main,
  },
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 16,
});

export default function SelectContent() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  return (
    <Tooltip 
      title={`${user?.UserData?.name?.first_name || 'User'} - ${user?.role || 'No Role'}`} 
      placement="right"
      onClick={() => navigate('/')}
    >
      <StyledListItem 
        disableGutters 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', overflow:"hidden" }}>
          <ListItemAvatar>
            <img src={logo} alt="Vyapar Drishti" height={40} style={{borderRadius:"100%", overflow:"hidden"}} />
          </ListItemAvatar>
          
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Vyapar Drishti
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              {user?.role || 'NO ROLE'}
            </Typography>
          </Box>
        </Box>
        
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ mx: .1 }} 
        />
        
        <Typography variant="body2">
            {user?.UserData?.name?.first_name +" "+user?.UserData?.name?.last_name || 'User'}
          </Typography>
      </StyledListItem>
    </Tooltip>
  );
}



// import MuiAvatar from '@mui/material/Avatar';
// import MuiListItemAvatar from '@mui/material/ListItemAvatar';
// // import MenuItem from '@mui/material/MenuItem';
// import ListItemText from '@mui/material/ListItemText';
// // import ListItemIcon from '@mui/material/ListItemIcon';
// // import ListSubheader from '@mui/material/ListSubheader';
// // import { SelectChangeEvent } from '@mui/material/Select';
// import Divider from '@mui/material/Divider';
// import { styled } from '@mui/material/styles';
// // import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
// // import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
// // import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
// import { ListItem } from '@mui/material';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';

// const Avatar = styled(MuiAvatar)(({ theme }) => ({
//   width: 28,
//   height: 28,
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.text.secondary,
//   border: `1px solid ${theme.palette.divider}`,
// }));

// const ListItemAvatar = styled(MuiListItemAvatar)({
//   minWidth: 0,
//   marginRight: 12,
// });

// export default function SelectContent() {
//   // const [_, setCompany] = React.useState('');
//   const role = useSelector((state: RootState) => state.auth.user?.role)
  
//   // const handleChange = (event: SelectChangeEvent) => {
//   //   setCompany(event.target.value as string);
//   // };

//   return (
//     <ListItem
//       sx={{ 
//         paddingX: '6px', 
//         paddingY:"1px",
//         display: 'flex', 
//         alignItems: 'center', 
//         gap: '8px', 
//         border: "2px solid #cdcaca", 
//         width: "100%", 
//         borderRadius: "4px" }}
//     >
//       <ListItemAvatar>
//         <Avatar alt="Vyapar Drishti">
//           <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
//         </Avatar>
//       </ListItemAvatar>
//       <ListItemText primary="Vyapar Drishti" secondary={`${role}`} />
//       <Divider sx={{ marginTop: '8px' }} />
//     </ListItem>
//     // <Select
//     //   labelId="company-select"
//     //   id="company-simple-select"
//     //   value={company}
//     //   // onChange={handleChange}
//     //   displayEmpty
//     //   // inputProps={{ 'aria-label': 'Select company' }}
//     //   fullWidth
//     //   sx={{
//     //     maxHeight: 56,
//     //     width: 215,
//     //     '&.MuiList-root': {
//     //       p: '8px',
//     //     },
//     //     [`& .${selectClasses.select}`]: {
//     //       display: 'flex',
//     //       alignItems: 'center',
//     //       gap: '2px',
//     //       pl: 1,
//     //     },
//     //   }}
//     // >
//     //   {/* <ListSubheader sx={{ pt: 0 }}>Production</ListSubheader> */}
//     //   <MenuItem value="" >
//     //     <ListItemAvatar>
//     //       <Avatar alt="Vyapar Drishti">
//     //         <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
//     //       </Avatar>
//     //     </ListItemAvatar>
//     //     <ListItemText primary="Vyapar Drishti" secondary="Web app" />
//     //   </MenuItem>
//     //   {/* <MenuItem value={10}>
//     //     <ListItemAvatar>
//     //       <Avatar alt="Sitemark App">
//     //         <SmartphoneRoundedIcon sx={{ fontSize: '1rem' }} />
//     //       </Avatar>
//     //     </ListItemAvatar>
//     //     <ListItemText primary="Sitemark-app" secondary="Mobile application" />
//     //   </MenuItem>
//     //   <MenuItem value={20}>
//     //     <ListItemAvatar>
//     //       <Avatar alt="Sitemark Store">
//     //         <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
//     //       </Avatar>
//     //     </ListItemAvatar>
//     //     <ListItemText primary="Sitemark-Store" secondary="Web app" />
//     //   </MenuItem>
//     //   <ListSubheader>Development</ListSubheader>
//     //   <MenuItem value={30}>
//     //     <ListItemAvatar>
//     //       <Avatar alt="Sitemark Store">
//     //         <ConstructionRoundedIcon sx={{ fontSize: '1rem' }} />
//     //       </Avatar>
//     //     </ListItemAvatar>
//     //     <ListItemText primary="Sitemark-Admin" secondary="Web app" />
//     //   </MenuItem>
//     //   <Divider sx={{ mx: -1 }} />
//     //   <MenuItem value={40}>
//     //     <ListItemIcon>
//     //       <AddRoundedIcon />
//     //     </ListItemIcon>
//     //     <ListItemText primary="Add product" secondary="Web app" />
//     //   </MenuItem> */}
//     // </Select>
//   );
// }
