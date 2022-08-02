import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

// material
import { LoadingButton } from '@mui/lab';

import { Grid, Card, TextField, Container, FormControl } from '@mui/material';
import { Route, Link, Routes, useParams } from 'react-router-dom';

// components
import Page from '../../components/Page';
import ImageInput from '../../components/ImageInput';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';

import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../components/hook-form';

export default function EditBrand() {
  const [data, setData] = useState([]);
  const reviewRef = useRef();
  const params = useParams();
  // console.log(params);

  useEffect(() => {
    RestClient.GetRequest(`${AppUrl.AllBrands}/${params.id}`).then((res) => {
      setData({
        id: res.data.id,
        brand_name_en: res.data.attributes.brand_name_en,
        brand_name_ar: res.data.attributes.brand_name_ar,
        brand_image: `${AppUrl.BaseURL}${res.data.attributes.brand_image}`,
      });
    });
  }, []);
  console.log(data.brand_name_en);

  // form
  const defaultValues = {
    brand_name_en: 'data.brand_name_en',
    brand_name_ar: data.brand_name_ar,
    brand_image: data.brand_image,
    remember: true,
  };

  // const intialValues = {
  //   brand_name_en: data.brand_name_en,
  //   brand_name_ar: data.brand_name_ar,
  //   brand_image: data.brand_image,
  // };

  const methods = useForm({
    defaultValues,
    // intialValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
  } = methods;

  // on submit form
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('brand_image', data.brand_image[0]);
    formData.append('brand_name_en', data.brand_name_en);
    formData.append('brand_name_ar', data.brand_name_ar);
    console.log(formData.brand_image);
    axios
      .put(`${AppUrl.AllBrands}/${params.id}`, formData, AppUrl.config)
      .then((response) => {
        // setValue('brand_name_en', '');
        // setValue('brand_name_ar', '');
        // setValue('brand_image', '');
        // reviewRef.current.removeImage();
        return alert('Updated succecfully');
      })
      .catch((error) => {
        const keys = Object.keys(error.response.data.errors);
        keys.forEach((key, index) => {
          setError(key, { type: 'type', message: error.response.data.errors[key] });
        });

        console.log(error.response.data);
        return error.response.data.message;
      });
  };

  return (
    <Page title="Brand | Edit">
      <Container>
        <CusBreadcrumbs
          title="Edit brand"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Brands', path: '/' },
          ]}
          page="Edit brand"
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
