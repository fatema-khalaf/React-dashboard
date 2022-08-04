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
// ----------------------------------------------------------------------

export default function App() {
  // const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      {/* <Request /> */}
      <Router />
    </ThemeProvider>
    // </QueryClientProvider>
  );
}
