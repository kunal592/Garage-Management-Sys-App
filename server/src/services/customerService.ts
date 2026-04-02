import prisma from '../prisma/client';

export const getAllCustomers = async (search?: string) => {
  return prisma.customer.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    } : {},
    include: {
      vehicles: true
    }
  });
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: true,
      services: {
        include: { vehicle: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!customer) return null;

  return {
    ...customer,
    history: customer.services.map((s: any) => ({
      id: s.id,
      date: s.createdAt.toLocaleDateString(),
      type: Array.isArray(s.serviceItems) ? (s.serviceItems as string[]).join(', ') : 'Service',
      cost: s.totalCost,
      parts: s.partsCost,
      labour: s.serviceCost,
      status: s.status,
      notes: '', // Add notes if needed in schema later
      vehicleModel: s.vehicle.model,
    }))
  };
};

export const createCustomer = async (data: { name: string; phone: string; address?: string; vehicles?: any[] }) => {
  const { vehicles, ...customerData } = data;
  return prisma.customer.create({
    data: {
      ...customerData,
      vehicles: vehicles ? {
        create: vehicles
      } : undefined
    },
    include: {
      vehicles: true
    }
  });
};

export const searchCustomerByPhone = async (phone: string) => {
  return prisma.customer.findUnique({
    where: { phone }
  });
};
