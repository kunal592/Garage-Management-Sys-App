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
  // Simple analytics logic
  const now = new Date();
  const months = [];
  const revenueData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
    
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const monthServices = await prisma.service.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    const revenue = monthServices.reduce((acc: number, s: any) => acc + s.totalCost, 0);
    revenueData.push(revenue);
  }

  // Service distribution
  const allServices = await prisma.service.findMany();
  const distributionMap: Record<string, number> = {};
  
  allServices.forEach((s: any) => {
    if (!Array.isArray(s.serviceItems)) return;
    const items = s.serviceItems as string[];
    items.forEach(item => {
      distributionMap[item] = (distributionMap[item] || 0) + 1;
    });
  });

  const serviceDistribution = Object.entries(distributionMap).map(([name, count]) => ({
    name,
    population: count,
    color: '#000', // Placeholder, frontend handles colors
    legendFontColor: '#7F7F7F',
    legendFontSize: 15
  })).slice(0, 5);

  // Top customers
  const topCustomers = await prisma.customer.findMany({
    include: {
      services: true
    }
  });

  const topCustomersFormatted = topCustomers.map((c: any) => ({
    id: c.id,
    name: c.name,
    totalSpent: c.services.reduce((acc: number, s: any) => acc + s.totalCost, 0)
  })).sort((a: any, b: any) => b.totalSpent - a.totalSpent).slice(0, 5);

  return {
    monthlyRevenue: {
      labels: months,
      data: revenueData
    },
    serviceDistribution,
    topCustomers: topCustomersFormatted
  };
};
