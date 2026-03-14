import { MOCK_DATA, Customer, Part, ServiceHistory } from './mockData';

let customers = [...MOCK_DATA.customers];
let parts = [...MOCK_DATA.parts];
let services = customers.flatMap(c => c.history.map(h => ({ ...h, customerId: c.id })));

export const db = {
  customers: {
    findMany: () => customers,
    findUnique: (id: string) => customers.find(c => c.id === id),
    findByPhone: (phone: string) => customers.find(c => c.phone === phone),
    create: (data: any) => {
      const newCust = { ...data, id: String(customers.length + 1), vehicles: [], history: [] };
      customers.push(newCust);
      return newCust;
    }
  },
  vehicles: {
    create: (customerId: string, data: any) => {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        const newVehicle = { ...data, id: `v${Math.random().toString(36).substr(2, 4)}` };
        customer.vehicles.push(newVehicle);
        return newVehicle;
      }
      return null;
    }
  },
  services: {
    findMany: (status?: string) => {
      let results = [...services];
      if (status) {
        results = results.filter(s => s.status.toLowerCase() === status.toLowerCase());
      }
      return results;
    },
    create: (data: any) => {
      const newService = { ...data, id: `s${services.length + 1}`, status: 'Pending', date: new Date().toISOString() };
      services.push(newService);
      return newService;
    }
  },
  parts: {
    findMany: () => parts
  }
};
