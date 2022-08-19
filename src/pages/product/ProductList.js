/* eslint-disable */
import { useState, useEffect } from 'react';
// material
import { Container } from '@mui/material';
// components
import Page from '../../components/Page';
import List2 from '../../sections/@dashboard/list/ListProducts';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
// mock
import RestClient from 'src/RestAPI/RestClient';
import AppUrl from 'src/RestAPI/AppUrl';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name_en', label: 'Name english', alignRight: false },
  { id: 'brand_name_en', label: 'Brand', alignRight: false },
  { id: 'subsubcategory_name_en', label: 'Subsubcategory', alignRight: false },
  { id: 'product_qty', label: 'Quantity', alignRight: false },
  { id: 'selling_price', label: 'Price', alignRight: false },
  { id: 'product_tags_en', label: 'Tags', alignRight: false },
  { id: 'avatarUrl', label: 'Image', alignRight: false },
  { id: '' },
];
const COLLAPS_HEAD = [
  { id: 'name_ar', label: 'Name arabic', alignRight: false },
  { id: 'discount', label: 'Discount', alignRight: false },
  { id: 'product_code', label: 'Code', alignRight: false },
  { id: 'product_tags_ar', label: 'Tags arabic', alignRight: false },
  { id: 'product_size_en', label: 'Size', alignRight: false },
  { id: 'product_size_ar', label: 'Size arabic', alignRight: false },
  { id: 'product_color_en', label: 'Color', alignRight: false },
  { id: 'product_color_ar', label: 'Color arabic', alignRight: false },
];
const DESC_HEAD = [
  { id: 'short_descp_en', label: 'Short des', alignRight: false },
  { id: 'short_descp_ar', label: 'Short des arabic', alignRight: false },
  { id: 'long_descp_en', label: 'Long des', alignRight: false },
  { id: 'long_descp_ar', label: 'Long des arabic', alignRight: false },
];

// ----------------------------------------------------------------------

export default function ListBrand() {
  const [data, setData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    RestClient.GetRequest(AppUrl.Products).then((res) => {
      if (!res) {
        setError('Internal Error, Please try again later!');
      }
      return setData(
        res.data.map((item) => {
          return {
            id: item.id,
            name_en: item.attributes.product_name_en,
            brand_name_en: item.attributes.brand_name_en,
            subsubcategory_name_en: item.attributes.subsubcategory_name_en,
            product_qty: item.attributes.product_qty,
            selling_price: item.attributes.selling_price,
            product_tags_en: item.attributes.product_tags_en,
            avatarUrl: `${AppUrl.BaseURL}${item.attributes.product_thambnail}`,
            name_ar: item.attributes.product_name_ar,
            discount: item.attributes.discount,
            product_code: item.attributes.product_code,
            product_tags_ar: item.attributes.product_tags_ar,
            product_size_en: item.attributes.product_size_en,
            product_size_ar: item.attributes.product_size_ar,
            product_color_en: item.attributes.product_color_en,
            product_color_ar: item.attributes.product_color_ar,
            short_descp_en: item.attributes.short_descp_en,
            short_descp_ar: item.attributes.short_descp_ar,
            long_descp_en: item.attributes.long_descp_en,
            long_descp_ar: item.attributes.long_descp_ar,
          };
        })
      );
    });
    setIsLoading(false);
    setIsDeleted(false);
  }, [isDeleted]);
  // ----------------------------------------------------------------------
  return (
    <Page title="Products">
      <Container>
        <CusBreadcrumbs title="Products" links={[{ name: 'Dashboard', path: '/' }]} page="All products" />
        <List2
          TABLE_HEAD={TABLE_HEAD}
          COLLAPS_HEAD={COLLAPS_HEAD}
          DESC_HEAD={DESC_HEAD}
          data={data}
          setIsDeleted={setIsDeleted}
          avatar={7}
          editURL={`/dashboard/product/edit/`}
          deleteURL={`${AppUrl.Products}/`}
          isLoading={isLoading}
          error={error}
          withCollapse
        />
      </Container>
    </Page>
  );
}
