import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '/admin/profile',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '/admin/Settings',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  // Get logged in admin data
  const [admin, setAdmin] = useState([]);
  useEffect(() => {
    privateAxios
      .get(AppUrl.Admin)
      .then((res) => {
        console.log(res.data);
        setAdmin(res.data);
      })
      .catch((err) => {
        // TODO: handel error
        console.log(err);
      });
  }, []);
  // Logout user then redirect to login page
  const cookies = new Cookies(); // create cookies object
  const navigate = useNavigate();
  const handleClose = () => {
    axios
      .post(`${AppUrl.BaseURL}/admin/logout`, '', AppUrl.config)
      .then((response) => {
        cookies.remove('token');
        navigate('/login', { replace: true }); // redirect to login
      })
      .catch((error) => console.log(error.response)); // TODO: handel error
    setOpen(null);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={`${AppUrl.BaseURL}${admin.photo}`} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {admin.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {admin.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
