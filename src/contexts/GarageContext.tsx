import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Customer, MockData, MOCK_DATA, ServiceHistory, Vehicle, Part } from '../data/mockData';

interface GarageContextType {
  customers: Customer[];
  stats: MockData['stats'];
  analytics: MockData['analytics'];
  recentActivity: MockData['recentActivity'];
  addCustomer: (customer: Customer) => void;
  addService: (customerId: string, vehicleId: string, service: ServiceHistory) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerByPhone: (phone: string) => Customer | undefined;
  updateServiceStatus: (serviceId: string, status: 'Pending' | 'Performed') => void;
  getServiceById: (id: string) => any | undefined;
  parts: Part[];
}

export const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_DATA.customers);
  const [stats, setStats] = useState(MOCK_DATA.stats);
  const [recentActivity, setRecentActivity] = useState(MOCK_DATA.recentActivity);
  const [parts, setParts] = useState(MOCK_DATA.parts);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
    setStats(prev => ({
      ...prev,
      totalCustomers: prev.totalCustomers + 1,
      totalVehicles: prev.totalVehicles + customer.vehicles.length
    }));
  };

  const addService = (customerId: string, vehicleId: string, service: ServiceHistory) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const updatedHistory = [service, ...customer.history];
        const updatedVehicles = customer.vehicles.map(v =>
          v.id === vehicleId ? { ...v, lastService: service.date, nextServiceDate: service.nextServiceDate } : v
        );
        return { ...customer, history: updatedHistory, vehicles: updatedVehicles };
      }
      return customer;
    }));

    // Update stats
    setStats(prev => ({
      ...prev,
      todayRevenue: prev.todayRevenue + service.cost,
      todayServices: prev.todayServices + 1
    }));

    // Update recent activity
    const customer = customers.find(c => c.id === customerId);
    const vehicle = customer?.vehicles.find(v => v.id === vehicleId);

    if (customer && vehicle) {
      const newActivity = {
        id: service.id,
        customer: customer.name,
        type: service.type,
        cost: service.cost,
        time: service.date,
        vehicle: vehicle.model,
        status: service.status // Include status for visual feedback
      } as any;
      setRecentActivity(prev => [newActivity, ...prev].slice(0, 10));
    }
  };

  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const getCustomerByPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 5) return undefined;
    return customers.find(c => c.phone.replace(/\D/g, '').includes(cleanPhone));
  };
  const updateServiceStatus = (serviceId: string, status: 'Pending' | 'Performed') => {
    setCustomers(prev => prev.map(customer => ({
      ...customer,
      history: customer.history.map(service => 
        service.id === serviceId ? { ...service, status } : service
      )
    })));

    setRecentActivity(prev => prev.map(activity => 
      activity.id === serviceId ? { ...activity, status } : activity
    ));
  };

  const getServiceById = (id: string) => {
    for (const customer of customers) {
      const service = customer.history.find(s => s.id === id);
      if (service) {
        // We might want to know which vehicle this was for
        // Usually, the vehicle is linked in the service record notes or we can infer it
        // For simplicity, let's assume the service record has been enhanced or we search vehicles
        // In the mock data, vehicles are in the Customer.history objects sometimes too
        return {
          ...service,
          customerName: customer.name,
          customerPhone: customer.phone,
          // If we had vehicleId in service, we'd use that.
          // For now, let's look at recentActivity to see if it's there
          vehicleModel: recentActivity.find(a => a.id === id)?.vehicle || customer.vehicles[0]?.model
        };
      }
    }
    return undefined;
  };

  return (
    <GarageContext.Provider value={{
      customers,
      stats,
      analytics: MOCK_DATA.analytics,
      recentActivity,
      addCustomer,
      addService,
      getCustomerById,
      getCustomerByPhone,
      updateServiceStatus,
      getServiceById,
      parts
    }}>
      {children}
    </GarageContext.Provider>
  );
};
