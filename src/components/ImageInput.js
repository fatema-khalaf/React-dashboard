/* eslint-disable */

import React, { useRef, useState, forwardRef, useImperativeHandle, Children, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const ImageInput = forwardRef(({ useFormRegister, error, squire, name }, reviewRef) => {
  const Warper = styled('div')(({ theme }) => ({
    width: squire ? 244 : 144,
    height: squire ? 244 : 144,
    margin: 'auto',
    borderRadius: squire ? '8px' : '50%',
    padding: 8,
    border: `1px  dashed  ${alpha(theme.palette.grey[500], 0.32)}`,
  }));
  const Snoop = styled('div')(({ theme }) => ({
    zIndex: 0,
    width: '100%',
    height: '100%',
    outline: 'none',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: squire ? '8px' : '50%',
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

  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const theme = useTheme();

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // when user upload image show it in avatar div
  const reviewImage = (e) => {
    const [file] = e.target.files;

    setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    console.log(file);
    setShowAvatar(true);
  };

  // useImperativeHandle makes the methode inside it executable from parent component
  useImperativeHandle(reviewRef, () => ({
    // when form submitted remove all old data
    removeImage() {
      setAvatarUrl('');
      setShowAvatar(false);
    },
    addImage(imageUrl) {
      setAvatarUrl(imageUrl);
      console.log('changed');
      setShowAvatar(true);
    },
  }));

  // click on input feild when user clicks on content div
  const clickInput = () => {
    document.getElementById('input').click();
    console.log(document.getElementById('input').value);
  };

  // make onchange executes tow functions
  const contact = (e, fun1, fun2) => {
    fun1(e);
    fun2(e);
  };
  return (
    <Box>
      <div>
        <Warper sx={{ borderColor: error && !showAvatar && theme.palette.error['main'] }}>
          <Snoop>
            <input
              // hidden // do NOT make input hidden or display none, the useForm will not recognize input value
              id="input"
              accept="image/*"
              name="brand_image"
              {...useFormRegister(name, {
                onChange: (e) => reviewImage(e),
              })} // useForm code to make the input discoverable from useForm
              type="file"
              style={{
                zIndex: 55,
                width: '200px',
                height: '120px',
                opacity: 0,
                backgroundColor: 'red',
                position: 'absolute', // NOTE: MUST BE ABSOLUT because when image is displayed it takes all the div and input width become 0 which makes its value undescoverable from useform
                cursor: isHovering && 'pointer',
              }}
              // onChange={(e) => reviewImage(e)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />

            <Avatar
              alt="Remy Sharp"
              src={avatarUrl}
              sx={{
                width: '100%',
                height: '100%',
                display: showAvatar ? '' : 'none',
              }}
            />
            <Content
              onClick={clickInput}
              sx={{
                cursor: isHovering && 'pointer',
                opacity: showAvatar & !isHovering ? 0 : isHovering ? 0.72 : 1,
                color: showAvatar && '#ffffff',
                backgroundColor: showAvatar ? '#161c24' : error && !showAvatar && theme.palette.error['lighter'],
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

        {error && !showAvatar && (
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: theme.palette.error['main'], display: 'block', mt: 1.5, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}

        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block', mt: 1.5, textAlign: 'center' }}
        >
          Allowed *.jpeg, *.jpg, *.png
        </Typography>
      </div>
    </Box>
  );
});
export default ImageInput;
