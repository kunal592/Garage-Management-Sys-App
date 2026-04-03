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
    todayServices: todayServices.length,
    totalCustomers,
    totalVehicles,
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

export const getAnalytics = async () => {
  const now = new Date();
  const months = [];
  const revenueData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
    
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const result = await prisma.service.aggregate({
      _sum: { totalCost: true },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    revenueData.push(result._sum.totalCost || 0);
  }

  // Service distribution
  const allServices = await prisma.service.findMany({
    select: { serviceItems: true }
  });
  const distributionMap: Record<string, number> = {};
  
  allServices.forEach((s: any) => {
    if (!Array.isArray(s.serviceItems)) return;
    const items = s.serviceItems as string[];
    items.forEach(item => {
      distributionMap[item] = (distributionMap[item] || 0) + 1;
    });
  });

  const serviceDistribution = Object.entries(distributionMap)
    .sort((a, b) => b[1] - a[1]) // highest first
    .map(([name, count]) => ({
      name,
      population: count,
      color: '#000', // Frontend handles real colors
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    })).slice(0, 5);

  // Top customers
  const serviceSums = await prisma.service.groupBy({
    by: ['customerId'],
    _sum: { totalCost: true },
    orderBy: {
      _sum: { totalCost: 'desc' },
    },
    take: 5,
  });

  const topCustomerIds = serviceSums.map(s => s.customerId);

  const topCustomersData = await prisma.customer.findMany({
    where: { id: { in: topCustomerIds } },
    select: { id: true, name: true }
  });

  const topCustomersFormatted = serviceSums.map(s => {
    const cust = topCustomersData.find(c => c.id === s.customerId);
    return {
      id: s.customerId,
      name: cust?.name || 'Unknown',
      totalSpent: s._sum.totalCost || 0
    };
  });

  return {
    monthlyRevenue: {
      labels: months,
      data: revenueData
    },
    serviceDistribution,
    topCustomers: topCustomersFormatted
  };
};
