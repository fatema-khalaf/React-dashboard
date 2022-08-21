/* eslint-disable */

import { useRef, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';

import { Box, Grid, Card, Container, FormControl, IconButton, InputAdornment, Typography } from '@mui/material';
import ImageInput from '../../components/ImageInput';
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
import Iconify from '../../components/Iconify';

// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';

import AppUrl from '../../RestAPI/AppUrl';
import { FormProvider, RHFTextField, RHFCheckbox, RHFSwitchBase } from '../../components/hook-form';
import privateAxios from '../../RestAPI/axios';
import RestClient from '../../RestAPI/RestClient';

export default function CreateAdmin() {
  const reviewRef = useRef();
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const params = useParams();

  const defaultValues = {
    name: '',
    email: '',
    passwrod: '',
    password_confirmation: '',
    phone: '',
    photo: '',
    status: false,
    brand: false,
    category: false,
    product: false,
    orders: false,
    newsletter: false,
    setting: false,
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
    getValues,
    setValue,
  } = methods;

  useEffect(() => {
    async function getData() {
      try {
        const response = await privateAxios.get(`${AppUrl.Admins}/${params.id}`);
        const data = await response.data.data; // must await here else no data will be found

        setValue('name', data.attributes.name);
        setValue('email', data.attributes.email);
        setValue('photo', data.attributes.photo);
        setValue('status', data.attributes.status == 1 ? true : false);
        setValue('brand', data.attributes.brand == 1 ? true : false);
        setValue('category', data.attributes.category == 1 ? true : false);
        setValue('product', data.attributes.product == 1 ? true : false);
        setValue('orders', data.attributes.orders == 1 ? true : false);
        setValue('newsletter', data.attributes.newsletter == 1 ? true : false);
        setValue('setting', data.attributes.setting == 1 ? true : false);
        data.attributes.phone && setValue('phone', data.attributes.phone); // if the value null do not set it as input value

        setImageUrl(getValues('photo'));
        reviewRef.current.addImage(`${AppUrl.BaseURL}${data.attributes.photo}`);
      } catch (error) {
        // TODO: handel error
        console.log(error);
      }
    }
    getData();
  }, [imageUrl]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('photo', data.photo !== '' ? data.photo[0] : '');
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('status', data.status === true ? 1 : 0);
    formData.append('product', data.product === true ? 1 : 0);
    formData.append('brand', data.brand === true ? 1 : 0);
    formData.append('category', data.category === true ? 1 : 0);
    formData.append('newsletter', data.newsletter === true ? 1 : 0);
    formData.append('orders', data.orders === true ? 1 : 0);
    formData.append('setting', data.setting === true ? 1 : 0);

    privateAxios
      .post(`${AppUrl.Admins}/${params.id}`, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!')); // Show success alert
        navigate('/dashboard/admin/list'); // redirect user to list page
        return response;
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
    <Page title="Admin | Update">
      <Container>
        <CusBreadcrumbs
          title="Update an admin"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Admins', path: '/dashboard/admin/list' },
          ]}
          page="Update admin"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormControl sx={{ width: '100%', p: 3 }}>
                  <ImageInput
                    ref={reviewRef}
                    name="photo"
                    useFormRegister={register} // conect the input inside ImageInput with useForm
                    error={errors.photo && errors.photo.message}
                  />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Disabling this will banned
                      <br /> the admin from accessing admins <br /> dashboard
                    </Typography>
                  </Box>

                  <RHFSwitchBase name="status" />
                </FormControl>
                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    This admin will have access to:
                  </Typography>
                  <FormControl sx={{ width: '49%', mb: 3 }}>
                    <RHFSwitchBase name="brand" label="brand" />
                  </FormControl>
                  <FormControl sx={{ width: '49%', mb: 3 }}>
                    <RHFSwitchBase name="category" label="category" />
                  </FormControl>
                  <FormControl sx={{ width: '49%', mb: 3 }}>
                    <RHFSwitchBase name="product" label="product" />
                  </FormControl>
                  <FormControl sx={{ width: '49%', mb: 3 }}>
                    <RHFSwitchBase name="orders" label="orders" />
                  </FormControl>
                  <FormControl sx={{ width: '49%', mb: 3 }}>
                    <RHFSwitchBase name="newsletter" label="newsletter" />
                  </FormControl>
                  <FormControl sx={{ width: '49%', mb: 3 }}>
                    <RHFSwitchBase name="setting" label="setting" />
                  </FormControl>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Name" name="name" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Phone" name="phone" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Email" name="email" />
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
