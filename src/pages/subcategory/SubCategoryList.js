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
  { id: 'category_name', label: 'Category Name', alignRight: false },
  { id: 'name_en', label: 'Subcategory Name (english)', alignRight: false },
  { id: 'name_ar', label: 'Subcategory Name (arabic)', alignRight: false },
  { id: '' },
];
export default function SubcategoryList() {
  const [data, setData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    RestClient.GetRequest(`${AppUrl.Subcategories}?include=category`).then((res) => {
      if (!res) {
        setError('Internal Error, Please try again later!');
      }
      return setData(
        res.data.map((item) => {
          return {
            id: item.id,
            category_name: item.attributes.category.attributes.category_name_en,
            name_en: item.attributes.subcategory_name_en,
            name_ar: item.attributes.subcategory_name_ar,
          };
        })
      );
    });
    setIsLoading(false);
    setIsDeleted(false);
  }, [isDeleted]);
  // ----------------------------------------------------------------------
  return (
    <Page title="Subcategories">
      <Container>
        <CusBreadcrumbs title="Subcategories" links={[{ name: 'Dashboard', path: '/' }]} page="All subcategories" />
        <List
          TABLE_HEAD={TABLE_HEAD}
          data={data}
          setIsDeleted={setIsDeleted}
          editURL={`/dashboard/subcategory/edit/`}
          deleteURL={`${AppUrl.Subcategories}/`}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </Page>
  );
}
