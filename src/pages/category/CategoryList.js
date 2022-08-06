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
  { id: 'name_en', label: 'Name in english', alignRight: false },
  { id: 'name_ar', label: 'Name in arabic', alignRight: false },
  { id: 'icon', label: 'Icon', alignRight: false },
  { id: '' },
];
export default function CategoryList() {
  const [data, setData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    RestClient.GetRequest(AppUrl.Categries).then((res) => {
      if (!res) {
        setError('Internal Error, Please try again later!');
      }
      return setData(
        res.data.map((item) => {
          return {
            id: item.id,
            name_en: item.attributes.category_name_en,
            name_ar: item.attributes.category_name_ar,
            icon: item.attributes.category_icon,
          };
        })
      );
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    setIsDeleted(false);
  }, [isDeleted]);
  // ----------------------------------------------------------------------
  return (
    <Page title="Categories">
      <Container>
        <CusBreadcrumbs title="Categories" links={[{ name: 'Dashboard', path: '/' }]} page="All categories" />
        <List
          TABLE_HEAD={TABLE_HEAD}
          data={data}
          setIsDeleted={setIsDeleted}
          editURL={`/dashboard/category/edit/`}
          deleteURL={`${AppUrl.Categries}/`}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </Page>
  );
}
