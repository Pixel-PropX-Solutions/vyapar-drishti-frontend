import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ROLE_ENUM } from '@/utils/enums';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import { MenuItem } from '@/utils/types';
import { createMainListItems, secondaryListItems } from '@/utils/functions';

interface SideMenuMobileProps {
  open?: boolean | undefined;
  toggleDrawer?: (newOpen: boolean) => () => void;
}

export default function MenuContent({ toggleDrawer }: SideMenuMobileProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, current_company_id } = useSelector((state: RootState) => state.auth);
  const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
  const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
  const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const mainListItems = createMainListItems(user?.user_type ?? ROLE_ENUM.NULL, tax_enable);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderMenuList = (items: MenuItem[]) => {
    const handleToggle = (item: MenuItem) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        // Expand only this section, collapse others
        setOpenSections({ [item.text]: true });
        // Navigate to first child
        if (item.children[0] && item.children[0].path) {
          handleNavigation(item.children[0].path);
          if (toggleDrawer) toggleDrawer(false);
        }
      } else {
        // Collapse all sections
        setOpenSections({});
        // Navigate to this item's path
        if (item.path) {
          if (toggleDrawer) toggleDrawer(false);
          handleNavigation(item.path);
        }
      }
    };

    return (
      <List>
        {items.map((item, index) => {
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          const isOpen = openSections[item.text];

          return (
            <React.Fragment key={index}>
              <Tooltip title={item.text} placement="right" arrow>
                <ListItem
                  onClick={() => handleToggle(item)}
                  disablePadding
                  sx={{
                    display: "block",
                    my: 0.1,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemButton
                    selected={!!item.path && location.pathname.includes(item.path)}
                    sx={{
                      minHeight: 38,
                      justifyContent: isSmallScreen ? 'center' : 'initial',
                      px: 2.5,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                        fontWeight: theme.typography.fontWeightBold,
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isSmallScreen ? 0 : 2,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {hasChildren ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
                  </ListItemButton>
                </ListItem>
              </Tooltip>

              {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children!.map((child, childIdx) => (
                      <ListItem
                        key={`${item.text}-${childIdx}`}
                        disablePadding
                        onClick={() => child.path && handleNavigation(child.path)}
                      >
                        <ListItemButton
                          selected={!!child.path && location.pathname.includes(child.path)}
                          sx={{
                            pl: 6,
                            minHeight: 36,
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.primary.light,
                              fontWeight: theme.typography.fontWeightBold
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  return (
    <Stack
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 1,
      }}
    >
      {renderMenuList(mainListItems)}

      <Divider sx={{ mb: 'auto' }} />
      <Divider sx={{ mt: 'auto' }} />
      {renderMenuList(secondaryListItems)}
    </Stack>
  );
}