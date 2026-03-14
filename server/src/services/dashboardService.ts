import prisma from '../prisma/client';

export const getDashboardStats = async () => {
  const [totalCustomers, totalVehicles, todayServices] = await Promise.all([
    prisma.customer.count(),
    prisma.vehicle.count(),
    prisma.service.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ]);

  const todayRevenue = todayServices.reduce((acc: number, s: any) => acc + s.totalCost, 0);

  return {
    todayRevenue,
    todayServicesCount: todayServices.length,
    totalCustomers,
  };
};

export const getRecentActivity = async () => {
  const recentServices = await prisma.service.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      vehicle: true
    }
  });

  return recentServices.map((s: any) => ({
    id: s.id,
    customer: s.customer.name,
    type: Array.isArray(s.serviceItems) ? (s.serviceItems as string[]).join(', ') : 'Service',
    cost: s.totalCost,
    time: s.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    vehicle: s.vehicle.model,
    status: s.status as 'Pending' | 'Performed'
  }));
};
