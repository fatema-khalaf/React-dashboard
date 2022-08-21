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
// icon
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import { useTheme } from '@mui/material/styles';
import Badge from '../../components/Badge';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'photo', label: 'Photo', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'phone', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'brand', label: 'Brands', alignRight: false },
  { id: 'category', label: 'Categories', alignRight: false },
  { id: 'product', label: 'Products', alignRight: false },
  { id: 'orders', label: 'Orders', alignRight: false },
  { id: 'newsletter', label: 'Newsletter', alignRight: false },
  { id: 'setting', label: 'Settings', alignRight: false },
  { id: 'created_at', label: 'Joined', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function AdminList() {
  const [data, setData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const allowed = <TaskAltIcon sx={{ fontSize: '1.2rem', color: theme.palette.success['main'] }} />;
  const blocked = <BlockRoundedIcon sx={{ fontSize: '1.2rem', color: theme.palette.error['main'] }} />;

  useEffect(() => {
    setIsLoading(true);
    RestClient.GetRequest(AppUrl.Admins).then((res) => {
      if (!res) {
        setError('Internal Error, Please try again later!');
      }
      return setData(
        res.data.map((item) => {
          return {
            id: item.id,
            photo: `${AppUrl.BaseURL}${item.attributes.photo}`,
            name: item.attributes.name,
            // email: item.attributes.email,
            phone: item.attributes.phone,
            status: item.attributes.status === 1 ? <Badge active value="Active" /> : <Badge banned value="Banned" />,
            brand: item.attributes.brand === 1 ? allowed : blocked,
            category: item.attributes.category === 1 ? allowed : blocked,
            product: item.attributes.product === 1 ? allowed : blocked,
            orders: item.attributes.orders === 1 ? allowed : blocked,
            newsletter: item.attributes.newsletter === 1 ? allowed : blocked,
            setting: item.attributes.setting === 1 ? allowed : blocked,
            created_at: item.attributes.created_at,
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
    <Page title="Admins">
      <Container>
        <CusBreadcrumbs title="Adamins" links={[{ name: 'Dashboard', path: '/' }]} page="All admins" />
        <List
          TABLE_HEAD={TABLE_HEAD}
          data={data}
          setIsDeleted={setIsDeleted}
          avatar={1}
          editURL={`/dashboard/admin/edit/`}
          deleteURL={`${AppUrl.Admins}/`}
          isLoading={isLoading}
          error={error}
          nowrap
        />
      </Container>
    </Page>
  );
}
