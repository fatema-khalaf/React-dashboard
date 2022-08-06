// NOTE: THIS FILE NOT IN USE YET

import { useState, useRef } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
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
// import { FormProvider } from '../../components/hook-form';

import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../components/hook-form';

export default function Create() {
  const [brandNameEn, setBrandNameEn] = useState('');
  const [brandNameAr, setBrandNameAr] = useState('');
  const [image, setImage] = useState('');

  const reviewRef = useRef();

  const onSubmit = (event) => {
    event.preventDefault();
    const jsonObject = { brand_name_en: brandNameEn, brand_name_ar: brandNameAr, brand_image: image };
    axios
      .post(AppUrl.AllBrands, JSON.stringify(jsonObject), AppUrl.config)
      .then((response) => {
        setBrandNameEn('');
        setBrandNameAr('');
        setImage('');
        reviewRef.current.removeImage();
        return alert('Added succecfully');
      })
      .catch((error) => {
        console.log(error.response.data.message);
        return alert(error.response.data.message);
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
        <FormProvider onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormControl sx={{ width: '100%', p: 3 }}>
                  <ImageInput
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    ref={reviewRef}
                    required
                    name="image"
                  />
                </FormControl>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Brand Name in english"
                    variant="outlined"
                    name="brand_name_en"
                    value={brandNameEn}
                    onChange={(e) => setBrandNameEn(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Brand Name in arabic"
                    variant="outlined"
                    name="brand_name_ar"
                    value={brandNameAr}
                    onChange={(e) => setBrandNameAr(e.target.value)}
                    required
                  />
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
