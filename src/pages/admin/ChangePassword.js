import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
// material
import { Grid, Card, FormControl, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// API
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';
// components
import Iconify from '../../components/Iconify';
import { FormProvider, RHFTextField } from '../../components/hook-form';
// Alert context
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';

// ----------------------------------------------------------------------

const ChangePassword = ({ admin }) => {
  const [state, dispatch] = useContext(AlertContext);
  const navigate = useNavigate(); // to redirect user to any page
  const cookies = new Cookies(); // create cookies object
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const defaultValues = {
    password: '',
    password_confirmation: '',
    old_password: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  // on submit form
  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(data);
    formData.append('_method', 'PUT');
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    formData.append('old_password', data.old_password);
    privateAxios
      .post(`${AppUrl.Admins}/change-password/${admin}`, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!'));
        // logout user
        privateAxios
          .post(`${AppUrl.BaseURL}/admin/logout`, '', AppUrl.config)
          .then((response) => {
            cookies.remove('token');
            navigate('/login', { replace: true }); // redirect to login
          })
          .catch((error) => console.log(error.response)); // TODO: handel error

        return null;
      })
      .catch((error) => {
        const keys = Object.keys(error.response.data.errors);
        console.log(error.response.data);
        keys.forEach((key, index) => {
          setError(key, { type: 'type', message: error.response.data.errors[key] });
        });

        return error.response.data.message;
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card sx={{ p: 3 }}>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <RHFTextField
                label="Current password"
                name="old_password"
                type={showOldPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                        <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <RHFTextField
                label="New password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl sx={{ width: '100%', mb: 3 }}>
              <RHFTextField
                label="Confirm password"
                name="password_confirmation"
                type={showConfPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfPassword(!showConfPassword)} edge="end">
                        <Iconify icon={showConfPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <LoadingButton fullWidth size="large" type="submit" variant="contained">
              Save changes
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
export default ChangePassword;
