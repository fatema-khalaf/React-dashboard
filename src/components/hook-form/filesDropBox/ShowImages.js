import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Slide } from '@mui/material';
import { useState } from 'react';

export default function ShowImage({ images, setImages, setSendImages }) {
  // Style--------------------------------------------------------------
  const theme = useTheme();
  const Warper = styled('div')(({ theme }) => ({
    alignItems: 'flex-start',
    textDecoration: 'none',
    boxSizing: 'border-box',
    textAlign: 'left',
    padding: '0px',
    margin: '4px',
    width: ' 80px',
    height: '80px',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    display: 'inline-flex !important',
    border: '1px  solid rgba(145, 158, 171, 0.24)',
  }));
  const Span = styled('span')(({ theme }) => ({
    width: '100%',
    lineHeight: '0',
    display: 'block',
    overflow: 'hidden',
    position: 'relative',
    paddingTop: '100%',
  }));
  const Lazyspan = styled('span')(({ theme }) => ({
    color: 'transparent',
    display: 'inline-block',
    filter: ' blur(0)',
    transition: 'filter .3s',
    inset: ' 0px',
    lineHeight: '0',
    position: 'absolute',
    backgroundSize: ' cover !important',
  }));
  const Image = styled('img')(({ theme }) => ({
    display: 'block',
    maxWidth: '100%',
    minwidth: '100%',
    objectFit: 'cover',
    minHeight: '100%',
  }));
  // Functionality------------------------------------------------------------------
  const [slide, setSlide] = useState(true);

  const removeImage = (image) => {
    setSlide(false);
    setImages((prevState) => prevState.filter((item) => item.id !== image.id)); // remove image from preview
    setSendImages((prevState) => prevState.filter((item) => item.id !== image.id)); // remove image from files list
    setTimeout(() => {
      setSlide((prev) => !prev);
    }, 100);
  };

  const show = (image) => {
    return (
      <Slide direction="left" in={slide} mountOnEnter unmountOnExit>
        <Warper alignItems="flex-start" sx={{ display: 'flex' }}>
          <Span>
            <Lazyspan>
              <Image alt="" src={image.src} />
            </Lazyspan>
          </Span>
          <IconButton
            size="small"
            aria-label="delete"
            sx={{
              color: '#fff',
              position: 'absolute',
              right: '6px',
              top: '6px',
              padding: '2px',
              '&:hover': { backgroundColor: `${alpha(theme.palette.grey[700], 0.72)}` },
              backgroundColor: `${alpha(theme.palette.grey[900], 0.72)}`,
            }}
            onClick={() => removeImage(image)}
          >
            <ClearIcon fontSize="inherit" />
          </IconButton>
        </Warper>
      </Slide>
    );
  };
  return <List sx={{ width: '100%', margin: '24px 0px', padding: 0 }}>{images.map(show)}</List>;
}
