import { db } from '../data/mockDb';

export const addVehicleToCustomer = async (customerId: string, data: { model: string; vehicleNumber: string }) => {
  return db.vehicles.create(customerId, data);
};

export const updateVehicleServiceMeta = async (id: string, data: { lastServiceDate: string; nextServiceDate: string }) => {
  // Mock update
  return { id, ...data };
};
