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
import RestClient from '../../RestAPI/RestClient';
import AppUrl from '../../RestAPI/AppUrl';

export default function CreateSubcategory() {
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);
  const [categories, setCategories] = useState([]);

  const defaultValues = {
    category_id: '',
    subcategory_name_en: '',
    subcategory_name_ar: '',
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
    RestClient.GetRequest(AppUrl.Categries).then((res) => {
      if (!res) {
        dispatch(AlertAction.showErrorAlert('Internal Error, Please try again later!'));
        setError('category_id', { type: 'No reponse', message: 'Can not load Categories, Please try again later!' });
      } else {
        return setCategories(
          res.data.map((item) => {
            return {
              label: item.attributes.category_name_en,
              value: item.id,
            };
          })
        );
      }
    });
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('category_id', data.category_id);
    formData.append('subcategory_name_en', data.subcategory_name_en);
    formData.append('subcategory_name_ar', data.subcategory_name_ar);
    // Custom function to implement Create request to the API with error handling
    RestClient.CreateRequest(AppUrl.Subcategories, formData, setError)
      .then((res) => {
        if (res) {
          dispatch(AlertAction.showSuccessAlert('Add success!'));
          navigate('/dashboard/subcategory/list');
        }
      })
      .catch((error) => {
        dispatch(AlertAction.showErrorAlert(error));
        console.log(error);
      });
  };

  return (
    <Page title="Subcategory | Create">
      <Container>
        <CusBreadcrumbs
          title="Create a new subcategory"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Subcategories', path: '/dashboard/subcategory/list' },
          ]}
          page="New subcategory"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFSelectField label="Category Name" name="category_id" options={categories} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Subcategory Name in english" name="subcategory_name_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Subcategory Name in arabic" name="subcategory_name_ar" />
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
