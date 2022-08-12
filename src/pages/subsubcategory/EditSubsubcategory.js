import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Container, FormControl } from '@mui/material';
// API
import AppUrl from '../../RestAPI/AppUrl';
// components
import Page from '../../components/Page';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
import { FormProvider, RHFTextField, RHFSelectField } from '../../components/hook-form';
// Alert context
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
import privateAxios from '../../RestAPI/axios';

export default function EditSubcategory() {
  const params = useParams();
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
    async function getData() {
      try {
        const response = await privateAxios.get(`${AppUrl.Subsubcategories}/${params.id}?include=subcategory`);
        const data = await response.data.data; // must await here else no data will be found
        setValue('subcategory_id', data.attributes.subcategory.id);
        setValue('subsubcategory_name_en', data.attributes.subsubcategory_name_en);
        setValue('subsubcategory_name_ar', data.attributes.subsubcategory_name_ar);
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await privateAxios.get(AppUrl.Subcategories);
        const data = await response.data.data; // must await here else no data will be found
        return setSubcategories(
          data.map((item) => {
            return {
              label: item.attributes.subcategory_name_en,
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
    formData.append('subcategory_id', data.subcategory_id);
    formData.append('subsubcategory_name_en', data.subsubcategory_name_en);
    formData.append('subsubcategory_name_ar', data.subsubcategory_name_ar);
    privateAxios
      .post(`${AppUrl.Subsubcategories}/${params.id}`, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!')); // Show alert
        navigate('/dashboard/subsubcategory/list'); // redirect user to list page
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
    <Page title="subsubcategory | Edit">
      <Container>
        <CusBreadcrumbs
          title="Edit subsubcategory"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'subsubcategories', path: '/dashboard/subsubcategory/list' },
          ]}
          page="Edit subsubcategory"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFSelectField label="Subcategory Name" name="subcategory_id" options={subcategories} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Subsubcategory Name in english" name="subsubcategory_name_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Subsubcategory Name in arabic" name="subsubcategory_name_ar" />
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
