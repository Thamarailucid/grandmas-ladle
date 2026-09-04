import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export function useBusinessSettings() {
  return useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const response = await apiClient.get('/settings/business');
      return response.data;
    },
  });
}
