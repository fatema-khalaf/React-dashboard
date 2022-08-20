/* eslint-disable */
import { useRef, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
  FormProvider,
  RHFTextField,
  RHFCheckbox,
  RHFSwitchBase,
  RHFSelectField,
  TagsInput,
} from '../../components/hook-form';
// Api
import AppUrl from '../../RestAPI/AppUrl';
import privateAxios from '../../RestAPI/axios';
import RestClient from '../../RestAPI/RestClient';
import draftToHtml from 'draftjs-to-html';
import { useApiCall } from '../../components/requests/Query';
import useGetBrands from 'src/context/request/BrandsRequest';
import useGetSubsubcategories from 'src/context/request/SubsubcategoriesRequest';

export default function EditProduct() {
  const reviewRef = useRef();
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate(); // to redirect user to any page
  const [state, dispatch] = useContext(AlertContext);
  const [images, setImages] = useState([]);
  const params = useParams();

  // add brands and subsubcategories to select inputs
  const isComponentMounted = useRef(true); // to improve performance by prevention useGetSubsubcategories hook from implementing befor this component being mounted
  const isComponentMountedBrand = useRef(true); // to improve performance by prevention useGetbrands hook from implementing befor this component being mounted
  const { data: brands, error: brandsError } = useGetBrands(isComponentMountedBrand, []);
  const { data: subsubcategories, error: subsubcategoriesError } = useGetSubsubcategories(isComponentMounted, []);

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
    status: false,
    special_deals: false,
    special_offer: false,
    featured: false,
    hot_deals: false,
    product_tags_en: [],
    product_tags_ar: [],
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
    getValues,
    register,
    setValue,
  } = methods;

  // These fields 👇 do Not have controller, only get the values by prop functions and set values useing setvalue
  function handleTagsEnglish(items) {
    setValue('product_tags_en', items);
  }
  function handleTagsArabic(items) {
    setValue('product_tags_ar', items);
  }
  function handleSelecetedFiles(items) {
    const files = items.map((item) => item.file);
    setValue('images', files);
  }
  useEffect(() => {
    async function getData() {
      try {
        const response = await privateAxios.get(`${AppUrl.Products}/${params.id}`);
        const data = await response.data.data; // must await here else no data will be found
        setValue('product_name_en', data.attributes.product_name_en);
        setValue('brand_id', data.attributes.brand_id);
        setValue('subsubcategory_id', data.attributes.subsubcategory_id);
        setValue('product_qty', data.attributes.product_qty);
        setValue('selling_price', data.attributes.selling_price);
        setValue('product_tags_en', data.attributes.product_tags_en);
        setValue('product_name_ar', data.attributes.product_name_ar);
        setValue('discount', data.attributes.discount);
        setValue('product_code', data.attributes.product_code);
        setValue('product_tags_ar', data.attributes.product_tags_ar);
        data.attributes.product_size_en && setValue('product_size_en', data.attributes.product_size_en); // if the value null do not set it as input value
        data.attributes.product_size_en && setValue('product_size_ar', data.attributes.product_size_ar);
        data.attributes.product_color_en && setValue('product_color_en', data.attributes.product_color_en);
        data.attributes.product_color_ar && setValue('product_color_ar', data.attributes.product_color_ar);
        setValue('product_thambnail', data.attributes.product_thambnail);
        setValue('special_deals', data.attributes.special_deals == 1 ? true : false);
        setValue('special_offer', data.attributes.special_offer == 1 ? true : false);
        setValue('featured', data.attributes.featured == 1 ? true : false);
        setValue('hot_deals', data.attributes.hot_deals == 1 ? true : false);
        setValue('status', data.attributes.status == 1 ? true : false);
        setValue('short_descp_en', data.attributes.short_descp_en);
        setValue('short_descp_ar', data.attributes.short_descp_ar);
        setValue('long_descp_en', data.attributes.long_descp_en);
        setValue('long_descp_ar', data.attributes.long_descp_ar);
        // set images for dropbox image list
        setImages(
          data.attributes.product_images.map((item) => {
            return {
              id: item.id,
              src: `${AppUrl.BaseURL}${item.image_name}`,
              deleteUrl: `${AppUrl.Products}/${data.id}/images/${item.id}`,
            };
          })
        );

        setImageUrl(getValues('product_thambnail'));
        reviewRef.current.addImage(`${AppUrl.BaseURL}${data.attributes.product_thambnail}`);
      } catch (error) {
        // TODO: handel error
        console.log(error);
      }
    }
    getData();
  }, [imageUrl]);

  // on submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(data.status);
    formData.append('_method', 'PUT');
    formData.append('product_name_en', data.product_name_en);
    formData.append('product_name_ar', data.product_name_ar);
    formData.append(
      'long_descp_ar',
      typeof data.long_descp_ar === 'string' ? data.long_descp_ar : draftToHtml(data.long_descp_ar)
    );
    formData.append(
      'long_descp_en',
      typeof data.long_descp_en === 'string' ? data.long_descp_en : draftToHtml(data.long_descp_en)
    );
    formData.append(
      'short_descp_en',
      typeof data.short_descp_en === 'string' ? data.short_descp_en : draftToHtml(data.short_descp_en)
    );
    formData.append(
      'short_descp_ar',
      typeof data.short_descp_ar === 'string' ? data.short_descp_ar : draftToHtml(data.short_descp_ar)
    );
    formData.append('product_code', data.product_code);
    formData.append('product_qty', data.product_qty);
    formData.append('subsubcategory_id', data.subsubcategory_id);
    formData.append('brand_id', data.brand_id);
    formData.append('status', data.status === true ? 1 : 0);
    formData.append('special_deals', data.special_deals === true ? 1 : 0);
    formData.append('special_offer', data.special_offer === true ? 1 : 0);
    formData.append('featured', data.featured === true ? 1 : 0);
    formData.append('hot_deals', data.hot_deals === true ? 1 : 0);
    formData.append('product_tags_en', data.product_tags_en);
    formData.append('product_tags_ar', data.product_tags_ar);
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
      .post(`${AppUrl.Products}/${params.id}`, formData)
      .then((response) => {
        dispatch(AlertAction.showSuccessAlert('Update success!')); // Show success alert
        navigate('/dashboard/product/list'); // redirect user to list page
        return response;
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
    <Page title="Product | Edit">
      <Container>
        <CusBreadcrumbs
          title="Edit product"
          links={[
            { name: 'Dashboard', path: '/' },
            { name: 'Products', path: '/dashboard/product/list' },
          ]}
          page="Edit product"
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
                  <TextEdiotor name="short_descp_en" initialValue={getValues('short_descp_en')} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Short description (arabic)
                  </Typography>
                  <TextEdiotor name="short_descp_ar" initialValue={getValues('short_descp_ar')} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Long description (english)
                  </Typography>
                  <TextEdiotor name="long_descp_en" initialValue={getValues('long_descp_en')} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <Typography variant="body2" color="text.middle" sx={{ pb: 1 }}>
                    Long description (arabic)
                  </Typography>
                  <TextEdiotor name="long_descp_ar" initialValue={getValues('long_descp_ar')} />
                </FormControl>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <DropBox selectedFiles={handleSelecetedFiles} initialImages={images} />
                </FormControl>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ p: 2 }}>
                <FormControl sx={{ width: '100%', mb: 3 }}>
                  <RHFSwitchBase name="status" label="In stock" />
                </FormControl>
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
                    tags={getValues('product_tags_en')}
                    name="product_tags_en"
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
                    tags={getValues('product_tags_ar')}
                    name="product_tags_ar"
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
