import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Container, FormControl } from '@mui/material';
// API
import axios from 'axios';
import AppUrl from '../../RestAPI/AppUrl';
// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
import { FormProvider, RHFTextField, RHFSelectField } from '../../components/hook-form';
// Alert context
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';

export default function EditSubcategory() {
  const params = useParams();
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
    async function getData() {
      try {
        const response = await axios.get(`${AppUrl.Subcategories}/${params.id}?include=category`, AppUrl.config);
        const data = await response.data.data; // must await here else no data will be found
        setValue('category_id', data.attributes.category.id);
        setValue('subcategory_name_en', data.attributes.subcategory_name_en);
        setValue('subcategory_name_ar', data.attributes.subcategory_name_ar);
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await axios.get(AppUrl.Categries, AppUrl.config);
        const data = await response.data.data; // must await here else no data will be found
        console.log(data);
        return setCategories(
          data.map((item) => {
            return {
              label: item.attributes.category_name_en,
              value: item.id,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

  // on submit form
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('category_id', data.category_id);
    formData.append('subcategory_name_en', data.subcategory_name_en);
    formData.append('subcategory_name_ar', data.subcategory_name_ar);
    axios
      .post(`${AppUrl.Subcategories}/${params.id}`, formData, AppUrl.config)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!')); // Show alert
        navigate('/dashboard/subcategory/list'); // redirect user to list page
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
    <Page title="subcategory | Edit">
      <Container>
        <CusBreadcrumbs
          title="Edit subcategory"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'subcategories', path: '/dashboard/subcategory/list' },
          ]}
          page="Edit subcategory"
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
