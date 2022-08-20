import { useEffect, useState, useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
// Materials
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import { LoadingButton, TabContext, TabPanel, TabList } from '@mui/lab';
import { Grid, Card, Container, FormControl, Box, Tab } from '@mui/material';
// c\Components
import Page from '../../components/Page';
import ImageInput from '../../components/ImageInput';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import ChangePassword from './ChangePassword';
// Alert context
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
// API
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';

// ----------------------------------------------------------------------

const AdminProfile = () => {
  // Tabs logic
  const [tab, setTab] = useState('1');
  const handleChange = (event, newTab) => {
    setTab(newTab);
  };

  // Form logic
  const reviewRef = useRef();
  const [imageUrl, setImageUrl] = useState(null);
  const [state, dispatch] = useContext(AlertContext);
  const [id, setId] = useState('');

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    photo: '',
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
    register,
    getValues,
  } = methods;

  useEffect(() => {
    async function getData() {
      try {
        const response = await privateAxios.get(AppUrl.Admin);
        const data = await response.data; // must await here else no data will be found
        console.log(data);
        setValue('name', data.name);
        setValue('email', data.email);
        setValue('phone', data.phone);
        setValue('photo', data.photo);
        setId(data.id);
        setImageUrl(getValues('photo'));
        reviewRef.current.addImage(`${AppUrl.BaseURL}${data.photo}`);
      } catch (error) {
        // TODO: handel error
        console.log(error);
      }
    }
    getData();
  }, [imageUrl]);

  // on submit form
  const onSubmit = async (data) => {
    // Note: put method dose not accept brand_image(file)
    const formData = new FormData();
    console.log(data.photo[0]);
    formData.append('_method', 'PUT');
    formData.append('photo', data.photo[0]);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    privateAxios
      .post(`${AppUrl.Admins}/${id}`, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!')); // Show alert
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
    <Page title="Profile">
      <Container>
        <CusBreadcrumbs title="Profile" links={[{ name: 'Dashboard', path: '/' }]} page="Admin Profile" />
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab icon={<AccountBoxIcon />} iconPosition="start" label="General" value="1" />
              <Tab icon={<KeyIcon />} iconPosition="start" label="Change password" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <Card sx={{ p: 2 }}>
                    <FormControl sx={{ width: '100%', p: 3 }}>
                      <ImageInput
                        name="photo"
                        ref={reviewRef}
                        useFormRegister={register}
                        error={errors.photo && errors.photo?.message}
                      />
                    </FormControl>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={8}>
                  <Card sx={{ p: 3 }}>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <RHFTextField label="Name" name="name" />
                    </FormControl>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <RHFTextField label="Email address" name="email" />
                    </FormControl>
                    <FormControl sx={{ width: '100%', mb: 3 }}>
                      <RHFTextField label="Phone number" name="phone" />
                    </FormControl>
                    <LoadingButton fullWidth size="large" type="submit" variant="contained">
                      Save changes
                    </LoadingButton>
                  </Card>
                </Grid>
              </Grid>
            </FormProvider>
          </TabPanel>
          <TabPanel value="2">
            <ChangePassword admin={id} />
          </TabPanel>
        </TabContext>
      </Container>
    </Page>
  );
};
export default AdminProfile;
