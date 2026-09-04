import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AdminRoutes } from './routes/AdminRoutes';
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2C4A3B',
          colorInfo: '#2C4A3B',
          colorSuccess: '#2C4A3B',
          colorWarning: '#B8925A',
          colorError: '#B85C3E',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AdminRoutes />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
