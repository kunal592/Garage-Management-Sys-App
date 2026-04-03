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
  customerId: z.string().min(1, 'Customer ID is required'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  serviceItems: z.array(z.string()).optional(),
  serviceCost: z.number().min(0),
  partsCost: z.number().min(0),
  totalCost: z.number().min(0),
  status: z.string().optional(),
  nextServiceDate: z.string().optional().nullable(),
  selectedParts: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).optional()
});
