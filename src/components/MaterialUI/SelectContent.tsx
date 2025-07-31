import {
  Divider,
  Select,
  ListItemText,
  SelectChangeEvent,
  selectClasses,
  Avatar,
  MenuItem
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useEffect, useState, useRef } from 'react';
import CompanyEditingModal from '@/common/modals/CompanyEditingModal';
import { getCurrentCompany, getCurrentUser, switchCompany } from '@/services/auth';
import { getAllCompanies } from '@/services/company';
// import { updateUserSettings } from '@/services/user';
import { getAvatarColor, getInitials } from '@/utils/functions';
import toast from 'react-hot-toast';

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: theme.palette.primary.main,
  },
  padding: 2,
  margin: '4px 0',
}));

export default function SelectContent() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { current_company_id } = useSelector((state: RootState) => state.auth);
  const [detail, setDetails] = useState(
    {
      name: '',
      company: ''
    });
  const selectRef = useRef<HTMLButtonElement | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    (user?.company?.length ?? 0) === 0 ? 'Add Company' : (current_company_id || "")
  );

  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    setSelectedCompanyId((user?.company?.length ?? 0) === 0 ? 'Add Company' : (current_company_id || ""));
  }, [current_company_id, user?.company]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSelectedCompanyId(value);
    setDetails({
      ...detail,
      company: value
    });
    handleChangeCompany(value);
  };

  useEffect(() => {
    dispatch(getCurrentCompany());
  }, [dispatch]);

  const handleChangeCompany = async (com: string) => {
    dispatch(switchCompany(com))
      .unwrap().then((response) => {
        if (response) {
          dispatch(getCurrentUser());
          dispatch(getCurrentCompany());
          toast.success("Company changed successfully!");
        }
      }).catch((error) => {
        toast.error(error || "An unexpected error occurred. Please try again later.");
      });
  }

  useEffect(() => {
    setSelectedCompanyId(
      (user?.company?.length ?? 0) === 0
        ? 'Add Company'
        : current_company_id || ""
    );
  }, [current_company_id, user?.company]);

  return (
    <>
      <Select
        labelId="company-select"
        id="company-simple-select"
        value={selectedCompanyId}
        defaultValue="Add Company"
        onChange={handleChange}
        ref={selectRef}
        inputProps={{ 'aria-label': 'Select company' }}
        fullWidth
        open={selectOpen}
        onOpen={() => setSelectOpen(true)}
        onClose={() => setSelectOpen(false)}
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
        {(user?.company?.length ?? 0) > 0 ? user?.company?.map((company: any, index: number) => (
          <StyledMenuItem key={index} value={company.company_id}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: 2,
                ml: 1,
                objectFit: 'contain',
                bgcolor: getAvatarColor(company.company_name),
                fontSize: '.9rem',
                fontWeight: 700,
                boxShadow: `0 4px 12px ${alpha(getAvatarColor(company.company_name), 0.3)}`,
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                "&:hover": {
                  transform: 'scale(1.1)',
                }
              }}
              src={typeof company.image === 'string' ? company.image : (company.image instanceof File ? URL.createObjectURL(company.image) : '')}
            >
              {(getInitials(company.company_name))}
            </Avatar>
            <ListItemText secondary={user?.name?.first + " " + user?.name?.last || 'User'} primary={company.company_name} />
          </StyledMenuItem>
        ))
          : (
            <StyledMenuItem value={'Add Company'}
              onClick={() => {
                setSelectOpen(false); // Close dropdown
                if (selectRef.current) selectRef.current.blur();
                setIsCompanyEditing(true);
              }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  mr: 2,
                  ml: 1,
                  objectFit: 'contain',
                  bgcolor: getAvatarColor("Add Company"),
                  fontSize: '.9rem',
                  fontWeight: 700,
                  boxShadow: `0 4px 12px ${alpha(getAvatarColor("Add Company"), 0.3)}`,
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  "&:hover": {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <AddRoundedIcon sx={{
                  fontSize: '1rem',
                  color: 'primary.main',
                }} />
              </Avatar>
              <ListItemText primary="Add Company" secondary="Create New Company" />
            </StyledMenuItem>
          )
        }
        {(user?.company?.length ?? 0) > 0 &&
          <>
            <Divider sx={{ my: 1 }} />
            <StyledMenuItem value={'Add Company'}
              onClick={() => {
                setSelectOpen(false); // Close dropdown
                if (selectRef.current) selectRef.current.blur();
                setIsCompanyEditing(true);
              }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  mr: 2,
                  ml: 1,
                  objectFit: 'contain',
                  bgcolor: getAvatarColor("Add Company"),
                  fontSize: '.9rem',
                  fontWeight: 700,
                  boxShadow: `0 4px 12px ${alpha(getAvatarColor("Add Company"), 0.3)}`,
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  "&:hover": {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <AddRoundedIcon sx={{
                  fontSize: '1rem',
                  color: 'primary.main',
                }} />
              </Avatar>
              <ListItemText primary="Add Company" secondary="Create New Company" />
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
          dispatch(getCurrentCompany());
          dispatch(getAllCompanies());
        }}
      />
    </>
  );
}