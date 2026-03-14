import prisma from '../prisma/client';

export const addVehicleToCustomer = async (customerId: string, data: { model: string; vehicleNumber: string }) => {
  return prisma.vehicle.create({
    data: {
      ...data,
      customerId
    }
  });
};

export const updateVehicleServiceMeta = async (id: string, data: { lastServiceDate: string; nextServiceDate: string }) => {
  return prisma.vehicle.update({
    where: { id },
    data: {
      lastServiceDate: data.lastServiceDate ? new Date(data.lastServiceDate) : undefined,
      nextServiceDate: data.nextServiceDate ? new Date(data.nextServiceDate) : undefined,
    }
  });
};
