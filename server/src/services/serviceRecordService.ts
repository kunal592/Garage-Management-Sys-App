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
    nextServiceDate,
    status,
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
        status: status || 'Pending',
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
  }, {
    maxWait: 10000, // 10 seconds max wait for connection (good for serverless Postgres cold starts)
    timeout: 30000, // 30 seconds max duration
  });
};

export const getServiceById = async (id: string) => {
  const s = await prisma.service.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      parts: {
        include: { part: true }
      }
    }
  });

  if (!s) return null;

  return {
    id: s.id,
    date: s.createdAt.toLocaleDateString(),
    nextServiceDate: s.nextServiceDate ? s.nextServiceDate.toISOString() : null,
    status: s.status,
    type: Array.isArray(s.serviceItems) ? (s.serviceItems as string[]).join(', ') : 'Service',
    serviceItems: s.serviceItems,
    serviceCost: s.serviceCost,
    partsCost: s.partsCost,
    totalCost: s.totalCost,
    customerName: s.customer.name,
    customerPhone: s.customer.phone,
    vehicleModel: s.vehicle.model,
    vehicleNumber: s.vehicle.vehicleNumber,
    selectedParts: s.parts.map((sp: any) => ({
      id: sp.partId,
      name: sp.part.name,
      price: sp.priceAtTime,
      quantity: sp.quantity,
    })),
    customParts: [],
  };
};

export const updateServiceStatus = async (id: string, status: string) => {
  return prisma.service.update({
    where: { id },
    data: { status }
  });
};

export const getUpcomingServices = async () => {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const services = await prisma.service.findMany({
    where: {
      nextServiceDate: {
        gte: now,
        lte: in24Hours,
      }
    },
    include: {
      customer: true,
      vehicle: true
    },
    orderBy: { nextServiceDate: 'asc' }
  });

  return services.map((s: any) => ({
    serviceId: s.id,
    customerName: s.customer.name,
    phone: s.customer.phone,
    vehicleModel: s.vehicle.model,
    vehicleNumber: s.vehicle.vehicleNumber,
    nextServiceDate: s.nextServiceDate,
  }));
};
