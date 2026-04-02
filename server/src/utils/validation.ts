import { z } from 'zod';

export const vehicleSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  address: z.string().optional(),
  vehicles: z.array(vehicleSchema).optional(),
});

export const serviceSchema = z.object({
  customerId: z.string().cuid(),
  vehicleId: z.string().cuid(),
  serviceItems: z.array(z.string()).min(1, 'At least one service item is required'),
  serviceCost: z.number().min(0),
  partsCost: z.number().min(0),
  totalCost: z.number().min(0),
  nextServiceDate: z.string().optional().nullable(),
  selectedParts: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).optional()
});
