import * as Yup from 'yup';
import { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import AppUrl from '../../../RestAPI/AppUrl';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    axios
      .post(`${AppUrl.BaseURL}/admin/login`, formData, {
        // withCredentials:true, // this to accept cookies from api response
      })
      .then((response) => {
        navigate('/', { replace: true }); // redirect to dashboard
        window.location.reload(); // reload the page to solve no data bug
        const token = response.data.access_token; // get token from response
        const roles = response?.data?.roles; // if there is a roles? get it TODO: add roles to the laravel API
        const cookies = new Cookies(); // create cookies object
        cookies.set('token', token, { path: '/' }); // set the token as cookie
      })
      .catch((error) => {
        // TODO: handel error with notification
        // if (!err?.response) {
        //   setErrMsg('No Server Response');
        // } else if (err.response?.status === 400) {
        //   setErrMsg('Missing Username or Password');
        // } else {
        //   setErrMsg('Login Failed');
        // }
        setError('email', { type: 'type', message: error.response.data.message });
        setError('password', { type: 'type', message: error.response.data.message });
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
