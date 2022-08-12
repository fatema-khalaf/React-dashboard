import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Container, FormControl } from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import { FormProvider, RHFTextField, RHFSelectField } from '../../components/hook-form';
// alert
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
// API
import privateAxios from '../../RestAPI/axios';
import RestClient from '../../RestAPI/RestClient';
import AppUrl from '../../RestAPI/AppUrl';

export default function CreateSubsubcategory() {
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);
  const [subcategories, setSubcategories] = useState([]);

  const defaultValues = {
    subcategory_id: '',
    subsubcategory_name_en: '',
    subsubcategory_name_ar: '',
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

  useEffect(() => {
    RestClient.GetRequest(AppUrl.Subcategories).then((res) => {
      if (!res) {
        dispatch(AlertAction.showErrorAlert('Internal Error, Please try again later!'));
        setError('subcategory_id', {
          type: 'No reponse',
          message: 'Can not load Subcategories, Please try again later!',
        });
      } else {
        return setSubcategories(
          res.data.map((item) => {
            return {
              label: item.attributes.subcategory_name_en,
              value: item.id,
            };
          })
        );
      }
    });
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('subcategory_id', data.subcategory_id);
    formData.append('subsubcategory_name_en', data.subsubcategory_name_en);
    formData.append('subsubcategory_name_ar', data.subsubcategory_name_ar);
    privateAxios
      .post(AppUrl.Subsubcategories, formData)
      .then((response) => {
        setValue('subsubcategory_name_en', '');
        setValue('subsubcategory_name_ar', '');
        setValue('subcategory_id', '');
        dispatch(AlertAction.showSuccessAlert('Add success!'));
        navigate('/dashboard/subsubcategory/list');
        return response;
      })
      .catch((error) => {
        if (!error.response.data) {
          return dispatch(AlertAction.showErrorAlert('Server Not availabe, Please try again later!'));
        }
        if (error.response.data) {
          // Request made and server responded
          if (error.response.status === 404) {
            dispatch(AlertAction.showErrorAlert('Something went wrong, Please try again later!'));
          } else {
            const keys = Object.keys(error.response.data.errors);
            keys.forEach((key, index) => {
              setError(key, { type: 'type', message: error.response.data.errors[key] });
            });
          }
        } else {
          // Something happened in setting up the request that triggered an
          return dispatch(AlertAction.showErrorAlert('Internal Error, Please try again later!'));
        }
      });
  };

  return (
    <Page title="Subsubcategory | Create">
      <Container>
        <CusBreadcrumbs
          title="Create a new subsubcategory"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Subsubcategories', path: '/dashboard/subsubcategory/list' },
          ]}
          page="New subsubcategory"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFSelectField label="SubCategory Name" name="subcategory_id" options={subcategories} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Subsubcategory Name in english" name="subsubcategory_name_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Subsubcategory Name in arabic" name="subsubcategory_name_ar" />
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
