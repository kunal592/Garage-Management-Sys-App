import { db } from '../data/mockDb';
import { MOCK_DATA } from '../data/mockData';

export const getDashboardStats = async () => {
  const customers = db.customers.findMany();
  const services = db.services.findMany();
  
  // In a real app, these would be calculated from the DB
  return {
    todayRevenue: MOCK_DATA.stats.todayRevenue,
    todayServicesCount: MOCK_DATA.stats.todayServices,
    totalCustomers: customers.length,
  };
};

export const getRecentActivity = async () => {
  return MOCK_DATA.recentActivity;
};
