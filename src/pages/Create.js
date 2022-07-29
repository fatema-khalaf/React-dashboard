import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import {
  Grid,
  Link,
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Input,
  TextField,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  InputLabel,
  FormControl,
  TableContainer,
  TablePagination,
  Box,
  ListItemIcon,
} from '@mui/material';
import ImageInput from '../components/ImageInput';

//
import Page from '../components/Page';
import CusBreadcrumbs from '../components/CusBreadcrumbs';
import { FormProvider } from '../components/hook-form';

export default function Create() {
  return (
    <Page title="Brand | Create">
      <Container>
        <CusBreadcrumbs
          title="Create a new brand"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Brands', path: '/' },
          ]}
          page="New brand"
        />
        <FormProvider>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormControl sx={{ width: '100%', p: 3 }}>
                  <ImageInput />
                </FormControl>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <TextField fullWidth id="outlined-basic" label="Brand Name in english" variant="outlined" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <TextField fullWidth id="outlined-basic" label="Brand Name in arabic" variant="outlined" />
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
