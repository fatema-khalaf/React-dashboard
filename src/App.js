// React query
import { QueryClientProvider, QueryClient } from 'react-query';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

import Request from './components/requests/BrandsRequest';
import { AlertProvider } from './context/alertContext/alert-constext';
import CusSnackbar from './components/CusSnackbar';
// ----------------------------------------------------------------------

export default function App() {
  // const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <AlertProvider>
      <ThemeProvider>
        <ScrollToTop />
        <CusSnackbar />
        <BaseOptionChartStyle />
        {/* <Request /> */}
        <Router />
      </ThemeProvider>
    </AlertProvider>
    // </QueryClientProvider>
  );
}
