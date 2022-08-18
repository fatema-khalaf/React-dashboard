import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Avatar } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import ShowImage from './ShowImages';
import Svg from './SVG';
import useResponsive from '../../../hooks/useResponsive';

function DropBox({ selectedFiles, setRequired, required, initialImages }) {
  // Styling---------------------------------------------------------------
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

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
    acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const id = uuidv4(); // create uniqe id for each file
        setImages((prevState) => [...prevState, { id, src: e.target.result }]);
        setSendImages((prevState) => [...prevState, { id, file }]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  // Set the final files for submitting
  useEffect(() => {
    selectedFiles(sendImages);
  }, [sendImages, selectedFiles]);

  // set images if there are initailimages (for update case)
  useEffect(() => {
    if (initialImages) {
      setImages(initialImages);
    }
  }, [initialImages]);

  return (
    <Box sx={{ width: '100%' }}>
      <div
        style={{
          outline: 'none',
          padding: '40px 8px',
          borderRadius: '8px',
          backgroundColor: required ? theme.palette.error.lighter : 'rgb(244, 246, 248)',
          border: `1px dashed ${required ? theme.palette.error.main : theme.palette.grey[500_32]}`,
          '&:hover': { opacity: '0.72', cursor: 'pointer' },
        }}
      >
        <div
          {...getRootProps()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            textAlign: !mdUp && 'center',
            flexDirection: !mdUp && 'column',
          }}
        >
          <Box sx={{ width: '220px' }}>
            <Svg />
          </Box>
          <div>
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
        </div>
      </div>
      <Typography
        variant="caption"
        mb={1}
        sx={{
          color: theme.palette.error.main,
        }}
      >
        {required && required}
      </Typography>
      <ShowImage images={images} setImages={setImages} setSendImages={setSendImages} sendImages={sendImages} />
    </Box>
  );
}
export default DropBox;
