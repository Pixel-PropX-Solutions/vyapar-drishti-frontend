import {
  Divider,
  Select,
  ListItemText,
  SelectChangeEvent,
  selectClasses,
  Tooltip,
  MenuItem
} from '@mui/material';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
// import { useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png";
import MuiAvatar from '@mui/material/Avatar';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect, useState, useRef } from 'react';
import CompanyEditingModal from '@/common/CompanyEditingModal';
import { getCurrentCompany, getCurrentUser } from '@/services/auth';
import { getAllCompanies } from '@/services/company';
import { setCurrentCompany } from '@/services/user';

// Enhanced styled components
const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 36,
  height: 36,
  marginLeft: 6,
  marginRight: 6,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 1,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: theme.palette.primary.main,
  },
  padding: 1,
  margin: '4px 0',
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 40,
  marginRight: 10,
});

export default function SelectContent() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const currentCompany = useSelector((state: RootState) => state.auth.currentCompany);
  const [detail, setDetails] = useState(
    {
      name: '',
      company: ''
    });
  const selectRef = useRef<HTMLButtonElement | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setDetails({
      ...detail,
      company: event.target.value as string
    });
    handleChangeCompany(event.target.value as string)


  };

  useEffect(() => {
    dispatch(getCurrentCompany());
  }, [])

  const handleChangeCompany = async (com: string) => {
    dispatch(setCurrentCompany(com));
  }

  useEffect(() => {
    setDetails({
      name: user?.name?.first + " " + user?.name?.last || 'User',
      company: currentCompany
        ? currentCompany._id
        : (user?.company?.length ?? 0) > 0
          ? user?.company?.find((com) => com.is_selected === true)?.company_id || ''
          : 'Add Company'
    })

  }, [currentCompany, user]);


  return (
    <Tooltip
      title={`${detail?.name || 'User'} - ${user?.user_type.toUpperCase() || 'No Role'}`}
      placement="right"
    >
      <>
        <Select
          labelId="company-select"
          id="company-simple-select"
          value={detail?.company || ""}
          onChange={(e) => { handleChange(e); e.stopPropagation(); }}
          ref={selectRef}
          inputProps={{ 'aria-label': 'Select company' }}
          fullWidth
          sx={{
            maxHeight: 56,
            '&.MuiList-root': {
              p: '8px',
            },
            [`& .${selectClasses.select}`]: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pl: 1,
            },
          }}
        >
          {(user?.company?.length ?? 0) > 0 ? user?.company?.map((company, index) => (
            <StyledMenuItem key={index} value={company.company_id}>
              <ListItemAvatar>
                <img src={logo} alt="Vyapar Drishti" height={40} style={{ borderRadius: "100%", height: '40px', overflow: "hidden" }} />
              </ListItemAvatar>
              <ListItemText primary={user?.name?.first + " " + user?.name?.last || 'User'} secondary={company.company_name} />
            </StyledMenuItem>
          ))
            : (
              <StyledMenuItem value={'Add Company'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectRef.current) selectRef.current.blur();
                  setIsCompanyEditing(true);
                }}>
                <Avatar >
                  <AddRoundedIcon sx={{
                    fontSize: '1rem',
                    color: 'primary.main',
                  }} />
                </Avatar>
                <ListItemText primary="Add Company" secondary="Create New COmpany" />
              </StyledMenuItem>
            )
          }
          {(user?.company?.length ?? 0) > 0 &&
            <>
              <Divider sx={{ my: 1 }} />
              <StyledMenuItem value={'Add Company'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectRef.current) selectRef.current.blur();
                  setIsCompanyEditing(true);
                }}>
                <Avatar >
                  <AddRoundedIcon sx={{
                    fontSize: '1rem',
                    color: 'primary.main',
                  }} />
                </Avatar>
                <ListItemText primary="Add Company" secondary="Create New COmpany" />
              </StyledMenuItem>
            </>
          }
        </Select>
        <CompanyEditingModal
          open={isCompanyEditing}
          onClose={() => {
            setIsCompanyEditing(false);
          }}
          company={null}
          onCreated={async () => {
            setIsCompanyEditing(false);
            dispatch(getCurrentUser());
            dispatch(getAllCompanies());
          }}
        />
      </>
    </Tooltip>
  );
}