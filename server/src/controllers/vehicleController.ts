import { Request, Response, NextFunction } from 'express';
import * as vehicleService from '../services/vehicleService';

export const addVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.addVehicleToCustomer(id as string, req.body);
    if (!vehicle) return res.status(404).json({ message: 'Customer not found' });
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const updateMeta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.updateVehicleServiceMeta(id as string, req.body);
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};
