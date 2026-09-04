import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from './providers/QueryProvider';
import { AppRoutes } from './routes/AppRoutes';
import { BusinessSettingsProvider } from '../contexts/BusinessSettingsContext';
import { CartProvider } from '../contexts/CartContext';

function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        <BusinessSettingsProvider>
          <CartProvider>
            <AppRoutes />
            <Toaster position="bottom-right" />
          </CartProvider>
        </BusinessSettingsProvider>
      </QueryProvider>
    </HelmetProvider>
  );
}

export default App;
