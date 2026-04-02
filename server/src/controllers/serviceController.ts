import { Request, Response, NextFunction } from 'express';
import * as serviceRecordService from '../services/serviceRecordService';

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const services = await serviceRecordService.getAllServices(status as string);
    res.json(services);
  } catch (error) {
    next(error);
  }
};

import { serviceSchema } from '../utils/validation';

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = serviceSchema.parse(req.body);
    const service = await serviceRecordService.createService(validatedData);
    res.status(201).json(service);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: (error as any).errors });
    }
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const service = await serviceRecordService.getServiceById(id as string);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const service = await serviceRecordService.updateServiceStatus(id as string, status);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const getUpcoming = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await serviceRecordService.getUpcomingServices();
    res.json(services);
  } catch (error) {
    next(error);
  }
};
