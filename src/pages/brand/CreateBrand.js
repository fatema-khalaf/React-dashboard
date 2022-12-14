import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';

import { Grid, Card, Container, FormControl } from '@mui/material';
import ImageInput from '../../components/ImageInput';
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';

import AppUrl from '../../RestAPI/AppUrl';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../components/hook-form';
import privateAxios from '../../RestAPI/axios';

export default function Create() {
  const reviewRef = useRef();
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);

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
    formData.append('brand_image', data.brand_image !== '' ? data.brand_image[0] : '');
    formData.append('brand_name_en', data.brand_name_en);
    formData.append('brand_name_ar', data.brand_name_ar);
    privateAxios
      .post(AppUrl.Brands, formData)
      .then((response) => {
        setValue('brand_name_en', '');
        setValue('brand_name_ar', '');
        setValue('brand_image', '');
        reviewRef.current.removeImage(); // Remove the image from the image input
        dispatch(AlertAction.showSuccessAlert('Add success!')); // Show success alert
        navigate('/dashboard/brand/list'); // redirect user to list page
        return null;
      })
      .catch((error) => {
        const keys = Object.keys(error.response.data.errors);
        keys.forEach((key, index) => {
          setError(key, { type: 'type', message: error.response.data.errors[key] });
        });
        // TODO: Handel error of 404 not found
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
            { name: 'Brands', path: '/dashboard/brand/list' },
          ]}
          page="New brand"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                {/* <input type="file" {...register('brand_image')} onChange={(e) => console.log(e.target)} /> */}
                <FormControl sx={{ width: '100%', p: 3 }}>
                  <ImageInput
                    ref={reviewRef}
                    name="brand_image"
                    useFormRegister={register} // conect the input inside ImageInput with useForm
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
