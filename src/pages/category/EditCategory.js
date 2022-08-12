import { useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Container, FormControl } from '@mui/material';
// API
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';
// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// Alert context
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';

export default function EditCategory() {
  const params = useParams();
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

  useEffect(() => {
    async function getData() {
      try {
        const response = await privateAxios.get(`${AppUrl.Categries}/${params.id}`);
        const data = await response.data.data; // must await here else no data will be found
        setValue('category_name_en', data.attributes.category_name_en);
        setValue('category_name_ar', data.attributes.category_name_ar);
        setValue('category_icon', data.attributes.category_icon);
      } catch (error) {
        // TODO: Handel errors
        // console.log(error);
      }
    }
    getData();
  }, []);

  // on submit form
  const onSubmit = async (data) => {
    // Note: put method dose not accept brand_image(file)
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('category_icon', data.category_icon);
    formData.append('category_name_en', data.category_name_en);
    formData.append('category_name_ar', data.category_name_ar);
    privateAxios
      .post(`${AppUrl.Categries}/${params.id}`, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!')); // Show alert
        navigate('/dashboard/category/list'); // redirect user to list page
        return null;
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
    <Page title="Category | Edit">
      <Container>
        <CusBreadcrumbs
          title="Edit category"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'categories', path: '/dashboard/category/list' },
          ]}
          page="Edit category"
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
