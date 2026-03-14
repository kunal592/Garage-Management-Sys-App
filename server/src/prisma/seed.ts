import prisma from './client';
import { MOCK_DATA } from '../data/mockData';

async function main() {
  console.log('Start seeding...');

  // 1. Seed Parts
  console.log('Seeding parts...');
  for (const part of MOCK_DATA.parts) {
    await prisma.part.upsert({
      where: { id: part.id },
      update: {},
      create: {
        id: part.id,
        name: part.name,
        category: part.category,
        price: part.price,
        brand: part.brand
      }
    });
  }

  // 2. Seed Customers, Vehicles, and Services
  console.log('Seeding customers and history...');
  for (const cust of MOCK_DATA.customers) {
    // Create Customer
    const customer = await prisma.customer.upsert({
      where: { phone: cust.phone },
      update: {},
      create: {
        id: cust.id,
        name: cust.name,
        phone: cust.phone,
        address: cust.address
      }
    });

    // Create Vehicles
    for (const v of cust.vehicles) {
      const vehicle = await prisma.vehicle.upsert({
        where: { vehicleNumber: v.number },
        update: {},
        create: {
          id: v.id,
          model: v.model,
          vehicleNumber: v.number,
          customerId: customer.id,
          lastServiceDate: v.lastService ? new Date(v.lastService) : null,
          nextServiceDate: v.nextServiceDate ? new Date(v.nextServiceDate) : null,
        }
      });

      // Create Service History for this vehicle
      // The mock data has history per customer, but let's associate it with the vehicle
      // For simplicity, we'll map the customer history to their first vehicle if multiple exist
      // Or filter simple history.
      const vehicleHistory = cust.history.filter(h => h.vehicleModel === v.model || !h.vehicleModel);
      
      for (const h of vehicleHistory) {
        await prisma.service.upsert({
          where: { id: h.id },
          update: {},
          create: {
            id: h.id,
            customerId: customer.id,
            vehicleId: vehicle.id,
            status: h.status,
            serviceItems: [h.type],
            serviceCost: h.labour || 0,
            partsCost: h.parts || 0,
            totalCost: h.cost || 0,
            nextServiceDate: h.nextServiceDate ? new Date(h.nextServiceDate) : null,
            createdAt: new Date(h.date.split(' - ')[0] || h.date)
          }
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
