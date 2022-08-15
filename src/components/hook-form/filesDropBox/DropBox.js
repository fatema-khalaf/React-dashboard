import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Avatar } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import ShowImage from './ShowImages';
import Svg from './SVG';
import useResponsive from '../../../hooks/useResponsive';

function DropBox({ selectedFiles, setRequired, required }) {
  // Styling---------------------------------------------------------------
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const Warper = styled('div')(({ theme }) => ({
    outline: 'none',
    padding: '40px 8px',
    borderRadius: '8px',
    backgroundColor: 'rgb(244, 246, 248)',
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
    '&:hover': { opacity: '0.72', cursor: 'pointer' },
  }));
  const Section = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    textAlign: !mdUp && 'center',
    flexDirection: !mdUp && 'column',
  }));
  const Span = styled('span')(({ theme }) => ({
    margin: ' 0px',
    lineHeight: '1.57143',
    fontSize: '0.875rem',
    fontWeight: '400',
    color: 'rgb(0, 171, 85)',
    textDecoration: 'underline',
  }));

  // functions ---------------------------------------------------------------
  const [images, setImages] = useState([]); // preview images
  const [sendImages, setSendImages] = useState([]); // final files to submit
  const onDrop = useCallback((acceptedFiles) => {
    setRequired(false);
    console.log(required);

    acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState) => [...prevState, { id: index, src: e.target.result }]);
        setSendImages((prevState) => [...prevState, { id: index, file }]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const { getRootProps, getInputProps, acceptedFiles, open, isDragAccept, isFocused, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  // Set the final files for submitting
  useEffect(() => {
    selectedFiles(sendImages);
  }, [sendImages, selectedFiles]);

  return (
    <Box sx={{ width: '100%' }}>
      <Warper
        onClick={open}
        sx={{
          borderColor: required && theme.palette.error.main,
          backgroundColor: required && theme.palette.error.lighter,
        }}
      >
        <Section>
          <Box sx={{ width: '220px' }}>
            <Svg />
          </Box>
          <div style={{ padding: '24px' }} {...getRootProps({ isDragAccept, isFocused, isDragReject })}>
            <input {...getInputProps()} />
            <Typography
              variant="h5"
              mb={1}
              sx={{
                color: required && theme.palette.error.main,
              }}
            >
              Drop or select file
            </Typography>
            <p>
              Drop files here or click <Span>Browse</Span> thorough your machine
            </p>
          </div>
        </Section>
      </Warper>
      {/* <button className="upload-btn">Upload Images</button> */}
      <ShowImage images={images} setImages={setImages} setSendImages={setSendImages} sendImages={sendImages} />
    </Box>
  );
}
export default DropBox;
