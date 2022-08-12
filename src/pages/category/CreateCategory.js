import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';

import { Grid, Card, Container, FormControl } from '@mui/material';
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';

import AppUrl from '../../RestAPI/AppUrl';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import privateAxios from '../../RestAPI/axios';

export default function Create() {
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);

  const defaultValues = {
    category_name_en: '',
    category_name_ar: '',
    category_icon: '',
    remember: true,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('category_icon', data.category_icon);
    formData.append('category_name_en', data.category_name_en);
    formData.append('category_name_ar', data.category_name_ar);
    privateAxios
      .post(AppUrl.Categries, formData)
      .then((response) => {
        setValue('category_name_en', '');
        setValue('category_name_ar', '');
        setValue('category_icon', '');
        dispatch(AlertAction.showSuccessAlert('Add success!')); // Show success alert
        navigate('/dashboard/category/list'); // redirect user to list page
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
    <Page title="Category | Create">
      <Container>
        <CusBreadcrumbs
          title="Create a new category"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Categories', path: '/dashboard/category/list' },
          ]}
          page="New category"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Category Name in english" name="category_name_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Category Name in arabic" name="category_name_ar" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Category icon" name="category_icon" />
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
