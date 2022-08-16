import { Navigate, useRoutes } from 'react-router-dom';
import Cookies from 'universal-cookie';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import CreateBrand from './pages/brand/CreateBrand';
import ListBrand from './pages/brand/ListBrand';
import EditBrand from './pages/brand/EditBrand';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import CategoryList from './pages/category/CategoryList';
import EditCategory from './pages/category/EditCategory';
import CreateCategory from './pages/category/CreateCategory';
import { SubcategoryList, EditSubcategory, CreateSubcategory } from './pages/subcategory';
import { SubsubcategoryList, EditSubsubcategory, CreateSubsubcategory } from './pages/subsubcategory';
import { CreateProduct } from './pages/product';

// ----------------------------------------------------------------------

export default function Router() {
  const cookies = new Cookies();
  const isAuthenticated = cookies.get('token');
  return useRoutes(
    isAuthenticated
      ? [
          {
            path: '/dashboard/brand',
            element: <DashboardLayout />,
            children: [
              { path: 'create', element: <CreateBrand /> },
              { path: 'list', element: <ListBrand /> },
              { path: 'edit/:id', element: <EditBrand /> },
            ],
          },
          {
            path: '/dashboard/category',
            element: <DashboardLayout />,
            children: [
              { path: 'create', element: <CreateCategory /> },
              { path: 'list', element: <CategoryList /> },
              { path: 'edit/:id', element: <EditCategory /> },
            ],
          },
          {
            path: '/dashboard/subcategory',
            element: <DashboardLayout />,
            children: [
              { path: 'create', element: <CreateSubcategory /> },
              { path: 'list', element: <SubcategoryList /> },
              { path: 'edit/:id', element: <EditSubcategory /> },
            ],
          },
          {
            path: '/dashboard/subsubcategory',
            element: <DashboardLayout />,
            children: [
              { path: 'create', element: <CreateSubsubcategory /> },
              { path: 'list', element: <SubsubcategoryList /> },
              { path: 'edit/:id', element: <EditSubsubcategory /> },
            ],
          },
          {
            path: '/dashboard/product',
            element: <DashboardLayout />,
            children: [
              { path: 'create', element: <CreateProduct /> },
              // { path: 'list', element: <SubsubcategoryList /> },
              // { path: 'edit/:id', element: <EditSubsubcategory /> },
            ],
          },
          {
            path: '/dashboard',
            element: <DashboardLayout />,
            children: [
              { path: 'app', element: <DashboardApp /> },
              { path: 'user', element: <User /> },
            ],
          },
          {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
              { path: '/', element: <Navigate to={'/dashboard/app'} /> },
              { path: 'login', element: <Login /> },
              { path: 'register', element: <Register /> },
              { path: '404', element: <NotFound /> },
              { path: '*', element: <Navigate to="/404" /> },
            ],
          },
          { path: '*', element: <Navigate to="/404" replace /> },
        ]
      : [{ path: '*', element: <Login /> }]
  );
}
