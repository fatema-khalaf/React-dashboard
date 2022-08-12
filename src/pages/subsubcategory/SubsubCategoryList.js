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
  { id: 'subcategory_name', label: 'Subcategory Name', alignRight: false },
  { id: 'name_en', label: 'Subsubcategory Name (english)', alignRight: false },
  { id: 'name_ar', label: 'Subsubcategory Name (arabic)', alignRight: false },
  { id: '' },
];
export default function SubsubcategoryList() {
  const [data, setData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    RestClient.GetRequest(`${AppUrl.Subsubcategories}?include=subcategory`).then((res) => {
      if (!res) {
        setError('Internal Error, Please try again later!');
      }
      return setData(
        res.data.map((item) => {
          return {
            id: item.id,
            subcategory_name: item.attributes.subcategory.attributes.subcategory_name_en,
            name_en: item.attributes.subsubcategory_name_en,
            name_ar: item.attributes.subsubcategory_name_ar,
          };
        })
      );
    });
    setIsLoading(false);
    setIsDeleted(false);
  }, [isDeleted]);
  // ----------------------------------------------------------------------
  return (
    <Page title="Subsubcategories">
      <Container>
        <CusBreadcrumbs
          title="Subsubcategories"
          links={[{ name: 'Dashboard', path: '/' }]}
          page="All subsubcategories"
        />
        <List
          TABLE_HEAD={TABLE_HEAD}
          data={data}
          setIsDeleted={setIsDeleted}
          editURL={`/dashboard/subsubcategory/edit/`}
          deleteURL={`${AppUrl.Subsubcategories}/`}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </Page>
  );
}
