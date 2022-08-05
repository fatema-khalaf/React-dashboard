/* eslint-disable */
import { useState, useEffect } from 'react';
// material
import { Container } from '@mui/material';
// components
import Page from '../../components/Page';
import { List } from '../../sections/@dashboard/list';
import CusBreadcrumbs from '../../components/CusBreadcrumbs';
// mock
import RestClient from 'src/RestAPI/RestClient';
import AppUrl from 'src/RestAPI/AppUrl';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name_en', label: 'Name english', alignRight: false },
  { id: 'name_ar', label: 'Name arabic', alignRight: false },
  { id: 'avatarUrl', label: 'Image', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ListBrand() {
  const [data, setData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    RestClient.GetRequest(AppUrl.AllBrands).then((res) => {
      return setData(
        res.data.map((item) => {
          return {
            id: item.id,
            name_en: item.attributes.brand_name_en,
            name_ar: item.attributes.brand_name_ar,
            avatarUrl: `${AppUrl.BaseURL}${item.attributes.brand_image}`,
          };
        })
      );
    });
    setIsLoading(false);
    setIsDeleted(false);
  }, [isDeleted]);
  // ----------------------------------------------------------------------
  // console.log(data);
  // console.log(isLoading);
  return (
    <Page title="Brands">
      <Container>
        <CusBreadcrumbs title="Brands" links={[{ name: 'Dashboard', path: '/' }]} page="All brands" />
        <List
          TABLE_HEAD={TABLE_HEAD}
          data={data}
          setIsDeleted={setIsDeleted}
          editURL={`/dashboard/brand/edit/`}
          deleteURL={`${AppUrl.AllBrands}/`}
          isLoading={isLoading}
        />
      </Container>
    </Page>
  );
}
