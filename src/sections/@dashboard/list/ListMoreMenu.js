import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import axios from 'axios';
import AppUrl from '../../../RestAPI/AppUrl';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ListMoreMenu(id) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handeleDelete = () => {
    axios
      .delete(`${AppUrl.AllBrands}/${id.id}`)
      .then((response) => console.log('deleted'))
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ListItemButton
          key="Delete"
          // component={RouterLink}
          // to="/dashboard/brand/edit"
          onClick={handeleDelete}
        >
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="eva:trash-2-outline" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </ListItemButton>
        <ListItemButton
          key={id}
          // component={RouterLink}
          to={`/dashboard/brand/edit/${id.id}`}
        >
          <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="eva:edit-fill" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </ListItemButton>
      </Menu>
    </>
  );
}
