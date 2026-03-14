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
  return prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: {
        include: {
          services: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      services: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
};

export const createCustomer = async (data: { name: string; phone: string; address?: string }) => {
  return prisma.customer.create({
    data
  });
};

export const searchCustomerByPhone = async (phone: string) => {
  return prisma.customer.findUnique({
    where: { phone }
  });
};
