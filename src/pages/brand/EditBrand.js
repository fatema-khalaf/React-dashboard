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
import { useAPI, APIContextProvider } from './Context';

export default function EditBrand() {
  const params = useParams();
  const reviewRef = useRef();
  const [imageUrl, setImageUrl] = useState(null);
  // const methods = useForm({
  //   // defaultValues,
  //   // intialValues,
  // });
  // const { register, handleSubmit, setError, reset, setValue, getValues, errors, formState } = methods;

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
    getValues,
  } = methods;

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${AppUrl.AllBrands}/${params.id}`);
        const data = await response.data.data; // must await here else no data will be found
        setValue('brand_name_en', data.attributes.brand_name_en);
        setValue('brand_name_ar', data.attributes.brand_name_ar);
        setValue('brand_image', data.attributes.brand_image);
        console.log(getValues('brand_image'));
        setImageUrl(getValues('brand_image'));
        // Todo: add image when the update page is loaded
        reviewRef.current.addImage(`${AppUrl.BaseURL}${data.attributes.brand_image}`);

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [imageUrl]);
  console.log(imageUrl);

  // on submit form
  const onSubmit = async (data) => {
    // Note: put method dose not accept brand_image(file)
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('brand_image', data.brand_image[0]);
    formData.append('brand_name_en', data.brand_name_en);
    formData.append('brand_name_ar', data.brand_name_ar);
    console.log(data.brand_image[0]);
    // 💥❌👉 laravel and PHP do NOT accept file in put methods so we need to make it post mathod then add _mathod: put with formData
    axios
      .post(`${AppUrl.AllBrands}/${params.id}`, formData, AppUrl.config)
      .then((response) => {
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
                    // imageURL={`http://127.0.0.1:8000/api/v1/${imageUrl}`}
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
                  Update
                </LoadingButton>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Page>
  );
}
