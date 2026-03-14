import { db } from '../data/mockDb';

export const getAllServices = async (status?: string) => {
  return db.services.findMany(status);
};

export const createService = async (data: any) => {
  // Logic:
  // 1. Create service record
  // 2. Store selected parts and quantities
  // 3. Update vehicle metadata (mock vehicle update)
  return db.services.create(data);
};

export const getServiceById = async (id: string) => {
  const services = db.services.findMany();
  return services.find(s => s.id === id);
};

export const updateServiceStatus = async (id: string, status: string) => {
  const services = db.services.findMany();
  const service = services.find(s => s.id === id);
  if (service) {
    (service as any).status = status;
    return service;
  }
  return null;
};

export const getUpcomingServices = async () => {
  const services = db.services.findMany();
  // Simplified logic: just return some services
  return services.slice(0, 5);
};
