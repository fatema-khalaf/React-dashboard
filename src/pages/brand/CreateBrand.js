import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// material
import { LoadingButton } from '@mui/lab';

import { Grid, Card, TextField, Container, FormControl } from '@mui/material';
import ImageInput from '../../components/ImageInput';

// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';

import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../components/hook-form';

export default function Create() {
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [imageFile, setImageFiel] = useState(null);
  const reviewRef = useRef();
  const navigate = useNavigate(); // to redirect user to any page

  const defaultValues = {
    brand_name_en: '',
    brand_name_ar: '',
    brand_image: '',
    remember: true,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('brand_image', data.brand_image[0]);
    formData.append('brand_name_en', data.brand_name_en);
    formData.append('brand_name_ar', data.brand_name_ar);

    axios
      .post(AppUrl.AllBrands, formData, AppUrl.config)
      .then((response) => {
        setValue('brand_name_en', '');
        setValue('brand_name_ar', '');
        setValue('brand_image', '');
        reviewRef.current.removeImage(); // Remove the image from the image input
        navigate('/dashboard/brand/list'); //redirect user to list page
        return alert('Added succecfully');
      })
      .catch((error) => {
        const keys = Object.keys(error.response.data.errors);
        keys.forEach((key, index) => {
          setError(key, { type: 'type', message: error.response.data.errors[key] });
        });
        return error.response.data.message;
      });
  };

  return (
    <Page title="Brand | Create">
      <Container>
        <CusBreadcrumbs
          title="Create a new brand"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Brands', path: '/' },
          ]}
          page="New brand"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormControl sx={{ width: '100%', p: 3 }}>
                  <ImageInput
                    ref={reviewRef}
                    useFormRegister={register('brand_image')} // conect the input inside ImageInput with useForm
                    error={errors.brand_image && errors.brand_image.message}
                  />
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Brand Name in english" name="brand_name_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Brand Name in arabic" name="brand_name_ar" />
                </FormControl>
                <LoadingButton fullWidth size="large" type="submit" variant="contained">
                  Create
                </LoadingButton>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}
