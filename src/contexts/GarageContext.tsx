import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Customer, MockData, ServiceHistory, Vehicle, Part } from '../data/mockData';
import { apiService } from '../utils/apiService';

interface GarageContextType {
  customers: Customer[];
  stats: MockData['stats'];
  analytics: MockData['analytics'] | null;
  recentActivity: MockData['recentActivity'];
  addCustomer: (customer: any) => Promise<void>;
  addService: (data: any) => Promise<void>;
  getCustomerById: (id: string) => Promise<Customer | null>;
  getCustomerByPhone: (phone: string) => Promise<Customer | null>;
  updateServiceStatus: (serviceId: string, status: 'Pending' | 'Performed') => Promise<void>;
  getServiceById: (id: string) => Promise<any>;
  parts: Part[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

export const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<MockData['stats']>({
    totalCustomers: 0,
    totalVehicles: 0,
    todayRevenue: 0,
    todayServices: 0
  });
  const [recentActivity, setRecentActivity] = useState<MockData['recentActivity']>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [analytics, setAnalytics] = useState<MockData['analytics'] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customersData, statsData, activityData, partsData, analyticsData] = await Promise.all([
        apiService.customers.getAll(),
        apiService.dashboard.getStats(),
        apiService.dashboard.getRecentActivity(),
        apiService.parts.getAll(),
        apiService.dashboard.getAnalytics(),
      ]);
      setCustomers(customersData);
      setStats(statsData);
      setRecentActivity(activityData);
      setParts(partsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCustomer = async (customerData: any) => {
    await apiService.customers.create(customerData);
    await fetchData();
  };

  const addService = async (serviceData: any) => {
    await apiService.services.create(serviceData);
    await fetchData();
  };

  const getCustomerById = async (id: string) => {
    try {
      return await apiService.customers.getById(id);
    } catch {
      return null;
    }
  };

  const getCustomerByPhone = async (phone: string) => {
    try {
      return await apiService.customers.getByPhone(phone);
    } catch {
      return null;
    }
  };

  const updateServiceStatus = async (serviceId: string, status: 'Pending' | 'Performed') => {
    await apiService.services.updateStatus(serviceId, status);
    await fetchData();
  };

  const getServiceById = async (id: string) => {
    return await apiService.services.getById(id);
  };

  return (
    <GarageContext.Provider value={{
      customers,
      stats,
      analytics,
      recentActivity,
      addCustomer,
      addService,
      getCustomerById,
      getCustomerByPhone,
      updateServiceStatus,
      getServiceById,
      parts,
      loading,
      refreshData: fetchData
    }}>
      {children}
    </GarageContext.Provider>
  );
};
