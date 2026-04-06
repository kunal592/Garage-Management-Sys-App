import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Analytics, Customer, DashboardStats, Part, RecentActivity, ServiceHistory } from '../data/types';
import { apiService } from '../utils/apiService';

// --- Dashboard Queries ---

export const useStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiService.dashboard.getStats(),
  });
};

export const useRecentActivity = () => {
  return useQuery<RecentActivity[]>({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => apiService.dashboard.getRecentActivity(),
  });
};

export const useAnalytics = () => {
  return useQuery<Analytics>({
    queryKey: ['dashboard', 'analytics'],
    queryFn: () => apiService.dashboard.getAnalytics(),
  });
};

// --- Customer Queries ---

export const useCustomers = (search?: string) => {
  return useQuery<Customer[]>({
    queryKey: ['customers', search],
    queryFn: () => apiService.customers.getAll(search),
  });
};

export const useCustomerDetail = (id: string) => {
  return useQuery<Customer>({
    queryKey: ['customer', id],
    queryFn: () => apiService.customers.getById(id),
    enabled: !!id,
  });
};

export const useCustomerByPhone = (phone: string) => {
  return useQuery<Customer>({
    queryKey: ['customer', 'phone', phone],
    queryFn: () => apiService.customers.getByPhone(phone),
    enabled: !!phone,
  });
};

export const useServiceDetail = (id: string) => {
  return useQuery<ServiceHistory>({
    queryKey: ['service', id],
    queryFn: () => apiService.services.getById(id),
    enabled: !!id,
  });
};

export const useServices = (status?: string) => {
  return useQuery<any[]>({
    queryKey: ['services', status],
    queryFn: () => apiService.services.getAll(status),
  });
};

export const useUpcomingServices = () => {
  return useQuery<any[]>({
    queryKey: ['services', 'upcoming'],
    queryFn: () => apiService.services.getUpcoming(),
  });
};

// --- Part Queries ---

export const useParts = () => {
  return useQuery<Part[]>({
    queryKey: ['parts'],
    queryFn: () => apiService.parts.getAll(),
  });
};

// --- Mutations ---

export const useAddCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.customers.create(data),
    onMutate: async (newCustomer) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });
      const previousCustomers = queryClient.getQueryData(['customers']);
      queryClient.setQueryData(['customers'], (old: any[] | undefined) => [
        ...(old || []),
        { ...newCustomer, id: Date.now().toString(), vehicles: newCustomer.vehicles || [] },
      ]);
      return { previousCustomers };
    },
    onError: (err, newCustomer, context) => {
      queryClient.setQueryData(['customers'], context?.previousCustomers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string, data: any }) => apiService.vehicles.add(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.services.create(data),
    onMutate: async (newService) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard', 'recent-activity'] });
      await queryClient.cancelQueries({ queryKey: ['services'] });
      
      const previousServices = queryClient.getQueryData(['services', undefined]);
      const previousActivity = queryClient.getQueryData(['dashboard', 'recent-activity']);

      // Optimistically update recent activity
      queryClient.setQueryData(['dashboard', 'recent-activity'], (old: any[] | undefined) => [
        {
          id: Date.now().toString(),
          customer: { name: 'Updating...' },
          vehicle: { model: 'Updating...' },
          type: Array.isArray(newService.serviceItems) ? newService.serviceItems.join(', ') : 'Service',
          cost: newService.totalCost,
          status: newService.status || 'Pending',
          time: 'Just now'
        },
        ...(old || []),
      ]);

      return { previousServices, previousActivity };
    },
    onError: (err, newService, context) => {
      queryClient.setQueryData(['dashboard', 'recent-activity'], context?.previousActivity);
      queryClient.setQueryData(['services', undefined], context?.previousServices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiService.services.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'recent-activity'] });
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });
};
