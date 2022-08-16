/* eslint-disable */
import { useRef, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// material
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Container, FormControl, Typography, InputAdornment } from '@mui/material';
// alert
import AlertAction from '../../context/alertContext/AlertAction';
import { AlertContext } from '../../context/alertContext/alert-constext';
// components
import Page from '../../components/Page';
import ImageInput from '../../components/ImageInput';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
import DropBox from '../../components/hook-form/filesDropBox/DropBox';
import { TextEdiotor } from '../../components/hook-form/TextEdiotor';
import { FormProvider, RHFTextField, RHFCheckbox, RHFSelectField, TagsInput } from '../../components/hook-form';
// Api
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';
import RestClient from '../../RestAPI/RestClient';
import draftToHtml from 'draftjs-to-html';

export default function CreateProduct() {
  const reviewRef = useRef();
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);
  const [desc, setDesc] = useState();
  const [required, setRequired] = useState(false); // set multi image filed required
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const defaultValues = {
    product_name_en: '',
    product_name_ar: '',
    long_descp_ar: '',
    long_descp_en: '',
    short_descp_en: '',
    short_descp_ar: '',
    product_code: '',
    product_qty: '',
    subsubcategory_id: '',
    brand_id: '',
    special_deals: '',
    special_offer: '',
    featured: '',
    hot_deals: '',
    tags_english: '',
    tags_arabic: '',
    images: '',
    selling_price: '',
    discount: '',
    product_thambnail: '',
    product_color_en: '',
    product_color_ar: '',
    product_size_en: '',
    product_size_ar: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
    setValue,
  } = methods;

  // These fields 👇 do Not have controller, only get the values by prop functions and set values useing setvalue
  function handleTagsEnglish(items) {
    setValue('tags_english', items);
  }
  function handleTagsArabic(items) {
    setValue('tags_arabic', items);
  }
  function handleSelecetedFiles(items) {
    const files = items.map((item) => item.file);
    setValue('images', files);
  }

  // add brands and subsubcategories to select inputs
  useEffect(() => {
    // TODO: create custom hook to do these request
    RestClient.GetRequest(AppUrl.Subsubcategories).then((res) => {
      if (!res) {
        dispatch(AlertAction.showErrorAlert('Internal Error, Please try again later!'));
        setError('subsubcategory_id', { type: 'No reponse', message: 'Can not load data, Please try again later!' });
      } else {
        return setSubsubcategories(
          res.data.map((item) => {
            return {
              label: item.attributes.subsubcategory_name_en,
              value: item.id,
            };
          })
        );
      }
    });

    RestClient.GetRequest(AppUrl.Brands).then((res) => {
      if (!res) {
        dispatch(AlertAction.showErrorAlert('Internal Error, Please try again later!'));
        setError('brand_id', { type: 'No reponse', message: 'Can not load data, Please try again later!' });
      } else {
        return setBrands(
          res.data.map((item) => {
            return {
              label: item.attributes.brand_name_en,
              value: item.id,
            };
          })
        );
      }
    });
  }, []);
  // on submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(data);
    if (data.images.length === 0) {
      setRequired('This field is required, add at least one image');
    }
    formData.append('product_name_en', data.product_name_en);
    formData.append('product_name_ar', data.product_name_ar);
    formData.append('long_descp_ar', draftToHtml(data.long_descp_ar));
    formData.append('long_descp_en', draftToHtml(data.long_descp_en));
    formData.append('short_descp_en', draftToHtml(data.short_descp_en));
    formData.append('short_descp_ar', draftToHtml(data.short_descp_ar));
    formData.append('product_code', data.product_code);
    formData.append('product_qty', data.product_qty);
    formData.append('subsubcategory_id', data.subsubcategory_id);
    formData.append('brand_id', data.brand_id);
    formData.append('special_deals', data.special_deals === true ? 1 : 0);
    formData.append('special_offer', data.special_offer === true ? 1 : 0);
    formData.append('featured', data.featured === true ? 1 : 0);
    formData.append('hot_deals', data.hot_deals === true ? 1 : 0);
    formData.append('tags_english', data.product_tags_en);
    formData.append('tags_arabic', data.product_tags_ar);
    formData.append('product_color_en', data.product_color_en);
    formData.append('product_color_ar', data.product_color_ar);
    formData.append('product_size_ar', data.product_size_ar);
    formData.append('product_size_en', data.product_size_en);
    formData.append('selling_price', data.selling_price);
    formData.append('discount', data.discount);
    // multi files
    Array.from(data.images).forEach((file) => {
      formData.append('images[]', file);
    });
    formData.append('product_thambnail', data.product_thambnail !== '' ? data.product_thambnail[0] : '');
    privateAxios
      .post(AppUrl.Products, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Add success!')); // Show success alert
        navigate('/dashboard/product/list'); // redirect user to list page
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
    <Page title="Product | Create">
      <Container>
        <CusBreadcrumbs
          title="Create a new product"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Products', path: '/dashboard/product/list' },
          ]}
          page="New product"
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ p: 2, mb: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product Name in english" name="product_name_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product Name in arabic" name="product_name_ar" />
                </FormControl>
              </Card>
              <Card sx={{ p: 3 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Short description (english)
                  </Typography>
                  <TextEdiotor name="short_descp_en" initialValue={desc} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Short description (arabic)
                  </Typography>
                  <TextEdiotor name="short_descp_ar" initialValue={desc} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Long description (english)
                  </Typography>
                  <TextEdiotor name="long_descp_en" initialValue={desc} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Long description (arabic)
                  </Typography>
                  <TextEdiotor name="long_descp_ar" initialValue={desc} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <DropBox selectedFiles={handleSelecetedFiles} required={required} setRequired={setRequired} />
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product code" name="product_code" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product quantity" name="product_qty" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFSelectField label="Category" name="subsubcategory_id" options={subsubcategories} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFSelectField label="Brand" name="brand_id" options={brands} />
                </FormControl>
              </Card>
              <Card sx={{ p: 2, mt: 2 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product color english" name="product_color_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product color arabic" name="product_color_ar" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product size english" name="product_size_en" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField label="Product size arabic" name="product_size_ar" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <TagsInput
                    selectedTags={handleTagsEnglish}
                    fullWidth
                    variant="outlined"
                    id="tags"
                    name="tags_english"
                    placeholder="add Tags"
                    label="tags english"
                  />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <TagsInput
                    selectedTags={handleTagsArabic}
                    fullWidth
                    variant="outlined"
                    id="tags"
                    name="tags_arabic"
                    placeholder="add Tags"
                    label="tags arabic"
                  />
                </FormControl>
              </Card>
              <Card sx={{ p: 2, mt: 2 }}>
                <FormControl sx={{ width: '100%', p: 1 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Product thambnail
                  </Typography>
                  <ImageInput
                    squire
                    ref={reviewRef}
                    name="product_thambnail"
                    useFormRegister={register}
                    error={errors.product_thambnail && errors.product_thambnail.message}
                  />
                </FormControl>
              </Card>
              <Card sx={{ p: 2, mt: 2 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFTextField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    label="Selling price"
                    name="selling_price"
                  />
                </FormControl>
                <FormControl sx={{ width: '100%' }}>
                  <RHFTextField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    label="Discount price"
                    name="discount"
                  />
                </FormControl>
              </Card>
              <Card sx={{ p: 2, mt: 2 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFCheckbox name="hot_deals" label="Hot deals" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFCheckbox name="featured" label="Featured" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFCheckbox name="special_offer" label="Special offer" />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFCheckbox name="special_deals" label="Special deals" />
                </FormControl>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                >
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
