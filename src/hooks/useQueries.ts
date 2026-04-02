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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.services.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
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
