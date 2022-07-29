import React, { useRef, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const Warper = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '50%',
  padding: 8,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));
const Snoop = styled('div')(({ theme }) => ({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '50%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
}));
const Content = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: `rgb(99, 115, 129)`,
  backgroundColor: theme.palette.grey[200],
  transition: `opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

export default function ImageInput() {
  const fileRef = useRef();

  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleChange = (e) => {
    const [file] = e.target.files;
    setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    setShowAvatar(true);
  };

  return (
    <Box mb={4}>
      <div>
        <Warper>
          <Snoop>
            <input
              hidden
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={handleChange}
            />
            <Avatar
              alt="Remy Sharp"
              src={avatarUrl}
              // src="/static/mock-images/avatars/avatar_default.jpg"
              sx={{
                width: '100%',
                height: '100%',
                display: showAvatar ? '' : 'none',
              }}
            />
            <Content
              onClick={() => fileRef.current.click()}
              sx={{
                opacity: showAvatar && 0,
                color: showAvatar && '#ffffff',
                backgroundColor: showAvatar && '#161c24',
              }}
            >
              <AddAPhotoIcon sx={{}} />
              <Typography
                gutterBottom
                variant="caption"
                sx={{ color: showAvatar ? '#ffffff' : 'text.disabled', display: 'block', mt: 1.5 }}
              >
                Upload photo
              </Typography>
            </Content>
          </Snoop>
        </Warper>
        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block', mt: 1.5, textAlign: 'center' }}
        >
          Allowed *.jpeg, *.jpg, *.png, *.gif
        </Typography>
      </div>
    </Box>
  );
}
