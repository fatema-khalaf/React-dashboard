import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import axios from 'axios';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ListMoreMenu({ editURL, deleteURL, setIsDeleted }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handeleDelete = async () => {
    setIsOpen(false);
    await axios
      .delete(deleteURL)
      .then((response) => alert('deleted'))
      .catch((error) => {
        alert('This Brand related to many products you need to delete those products first!');
        console.error('There was an error!', error);
      });
    setIsDeleted(true);
  };
  // prop type
  ListMoreMenu.propTypes = {
    editURL: PropTypes.string, // edit route url
    deleteURL: PropTypes.string, // delete API endpoint
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
        <MenuItem sx={{ color: 'text.secondary' }} to="#" onClick={handeleDelete}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={editURL} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
