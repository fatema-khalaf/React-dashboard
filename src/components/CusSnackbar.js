/* eslint-disable */

import React, { useRef, useState, forwardRef, useImperativeHandle, Children, useEffect } from 'react';
import { Box, Typography, Avatar, Snackbar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarStyled = styled('div')(({ theme }) => ({
  backgroundColor: `${theme.palette.grey[0]} !important`,
  display: ' flex',
  color: theme.palette.grey[800],
  boxShadow: `${alpha(theme.palette.grey[500], 0.16)} 0px 8px 16px 0px`,
  padding: '9px',
  borderRadius: '8px',
  minWidth: '250px',
  alignItems: 'center',
  justifyContent: 'space-between',
}));
const IconHolder = styled('div')(({ theme }) => ({
  marginRight: '12px',
  width: '40px',
  height: '40px',
  display: 'flex',
  borderRadius: '12px',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgb(84, 214, 44)',
  backgroundColor: 'rgba(84, 214, 44, 0.16)',
}));
const Message = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
// -----------------------------------------------------------------------
// TODO: create a global context to manage alerts
const CusSnackbar = forwardRef(({}, alertRef) => {
  const [open, setOpen] = React.useState(false);
  const [type, settype] = React.useState('success');
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // useImperativeHandle makes the methode inside it executable from parent component
  useImperativeHandle(alertRef, () => ({
    ShowMessage(type, message) {
      console.log('open');
      settype(type);
      setOpen(true);
      setMessageInfo(message);
    },
  }));
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={4000}
      // onClose={handleClose}
      // TransitionComponent={state.Transition}
      key="test"
    >
      <SnackbarStyled>
        <Message>
          <IconHolder sx={type === 'error' ?? { color: '#ff4842', backgroundColor: '#ff323229' }}>
            <CheckCircleIcon />
          </IconHolder>
          <Typography variant="subtitle2">{messageInfo}</Typography>
        </Message>

        <IconButton aria-label="close" sx={{ p: 0.5 }} onClick={handleClose}>
          <CloseIcon sx={{ fontSize: '19px' }} />
        </IconButton>
      </SnackbarStyled>
    </Snackbar>
  );
});
export default CusSnackbar;
