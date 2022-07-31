import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
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

const ImageInput = forwardRef(({ name, onChange, value, required }, reviewRef) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileRef = useRef();
  const reviewImage = (e) => {
    const [file] = e.target.files;
    setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    setShowAvatar(true);
  };
  useImperativeHandle(reviewRef, () => ({
    removeImage() {
      setAvatarUrl('');
      setShowAvatar(false);
    },
  }));

  // make on \change executes tow functions
  const contact = (e, fun1, fun2) => {
    fun1(e);
    fun2(e);
  };

  return (
    <Box mb={4}>
      <div>
        <Warper>
          <Snoop>
            <input
              hidden
              accept="image/*"
              name={name}
              value={value}
              type="file"
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={(e) => contact(e, reviewImage, onChange)}
              required={required}
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
});
export default ImageInput;
