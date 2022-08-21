// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Brand',
    path: '/dashboard/brand/',
    icon: getIcon('icon-park-solid:engineering-brand'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/brand/create',
      },
      {
        title: 'List',
        path: '/dashboard/brand/list',
      },
    ],
  },
  {
    title: 'Category',
    path: '/dashboard/category/',
    icon: getIcon('mdi:shape'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/category/create',
      },
      {
        title: 'List',
        path: '/dashboard/category/list',
      },
    ],
  },
  {
    title: 'Subcategory',
    path: '/dashboard/subcategory/',
    icon: getIcon('carbon:collapse-categories'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/subcategory/create',
      },
      {
        title: 'List',
        path: '/dashboard/subcategory/list',
      },
    ],
  },
  {
    title: 'Subsubcategory',
    path: '/dashboard/subsubcategory/',
    icon: getIcon('carbon:expand-categories'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/subsubcategory/create',
      },
      {
        title: 'List',
        path: '/dashboard/subsubcategory/list',
      },
    ],
  },
  {
    title: 'product',
    path: '/dashboard/product/',
    icon: getIcon('mdi:tshirt-crew'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/product/create',
      },
      {
        title: 'List',
        path: '/dashboard/product/list',
      },
    ],
  },
  {
    title: 'orders',
    path: '/dashboard/order/',
    icon: getIcon('icon-park-solid:transaction-order'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/order/create',
      },
      {
        title: 'List',
        path: '/dashboard/order/list',
      },
    ],
  },
  {
    title: 'newsletter',
    path: '/dashboard/newsletter/',
    icon: getIcon('mdi:email-newsletter'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/newsletter/create',
      },
      {
        title: 'List',
        path: '/dashboard/newsletter/list',
      },
    ],
  },
  {
    title: 'admins',
    path: '/dashboard/admin/',
    icon: getIcon('eva:people-fill'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/admin/create',
      },
      {
        title: 'List',
        path: '/dashboard/admin/list',
      },
    ],
  },
  {
    title: 'settings',
    path: '/dashboard/setting/',
    icon: getIcon('icon-park-twotone:setting-two'),
    children: [
      {
        title: 'Create',
        path: '/dashboard/setting/create',
      },
      {
        title: 'List',
        path: '/dashboard/setting/list',
      },
    ],
  },

  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
