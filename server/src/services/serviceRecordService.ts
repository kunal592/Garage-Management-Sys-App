import prisma from '../prisma/client';

export const getAllServices = async (status?: string) => {
  return prisma.service.findMany({
    where: status ? { status } : {},
    include: {
      customer: true,
      vehicle: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createService = async (data: any) => {
  const { 
    customerId, 
    vehicleId, 
    serviceItems, 
    selectedParts, 
    serviceCost, 
    partsCost, 
    totalCost, 
    nextServiceDate 
  } = data;

  return prisma.$transaction(async (tx: any) => {
    // 1. Create service record
    const service = await tx.service.create({
      data: {
        customerId,
        vehicleId,
        serviceItems,
        serviceCost,
        partsCost,
        totalCost,
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : null,
      }
    });

    // 2. Store selected parts
    if (selectedParts && selectedParts.length > 0) {
      for (const p of selectedParts) {
        await tx.servicePart.create({
          data: {
            serviceId: service.id,
            partId: p.id,
            quantity: p.quantity,
            priceAtTime: p.price
          }
        });
      }
    }

    // 3. Update vehicle dates
    await tx.vehicle.update({
      where: { id: vehicleId },
      data: {
        lastServiceDate: new Date(),
        nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : null,
      }
    });

    return service;
  });
};

export const getServiceById = async (id: string) => {
  return prisma.service.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      parts: {
        include: {
          part: true
        }
      }
    }
  });
};

export const updateServiceStatus = async (id: string, status: string) => {
  return prisma.service.update({
    where: { id },
    data: { status }
  });
};

export const getUpcomingServices = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.service.findMany({
    where: {
      nextServiceDate: {
        lte: tomorrow,
        gte: new Date()
      }
    },
    include: {
      customer: true,
      vehicle: true
    }
  });
};
